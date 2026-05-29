import { supabase } from '../lib/supabase';
import type { ReportCategory } from './mock';

// Types for Supabase reports table
export type SupabaseReport = {
  id: string;
  category: ReportCategory;
  description: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  severity: 'alta' | 'media' | 'baja';
  photo_url: string | null;
  status: 'nuevo' | 'pendiente' | 'activo' | 'verificado' | 'resuelto';
  validations_count: number;
  created_at: string;
  updated_at: string;
};

export type CreateReportInput = {
  category: ReportCategory;
  description: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  severity: 'alta' | 'media' | 'baja';
  photo_url: string | null;
};

export type UpdateReportInput = Partial<{
  category: ReportCategory;
  description: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  severity: 'alta' | 'media' | 'baja';
  photo_url: string | null;
  status: 'nuevo' | 'pendiente' | 'activo' | 'verificado' | 'resuelto';
  validations_count: number;
}>;

/**
 * Create a new report in Supabase
 */
export const createReport = async (
  reportData: CreateReportInput
): Promise<SupabaseReport | null> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        category: reportData.category,
        description: reportData.description,
        address: reportData.address,
        lat: reportData.lat,
        lng: reportData.lng,
        severity: reportData.severity,
        photo_url: reportData.photo_url,
        status: 'nuevo',
        validations_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating report in Supabase:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating report:', error);
    return null;
  }
};

/**
 * Get all reports from Supabase, ordered by created_at descending
 */
export const getReports = async (): Promise<SupabaseReport[]> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching reports:', error);
    return [];
  }
};

/**
 * Subscribe to real-time changes on the reports table
 * Returns a subscription object that can be used to unsubscribe
 */
export const subscribeToReports = (
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: SupabaseReport | null;
    old: SupabaseReport | null;
  }) => void
) => {
  try {
    const subscription = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports',
        },
        (payload) => {
          callback({
            eventType: payload.eventType,
            new: payload.new as SupabaseReport | null,
            old: payload.old as SupabaseReport | null,
          });
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Supabase realtime subscription error');
        }
      });

    return subscription;
  } catch (error) {
    console.error('Error setting up realtime subscription:', error);
    // Return a dummy subscription object with unsubscribe method
    return {
      unsubscribe: () => {},
    };
  }
};

/**
 * Update a specific report in Supabase
 */
export const updateReport = async (
  reportId: string,
  data: UpdateReportInput
): Promise<SupabaseReport | null> => {
  try {
    const { data: updatedData, error } = await supabase
      .from('reports')
      .update(data)
      .eq('id', reportId)
      .select()
      .single();

    if (error) {
      console.error('Error updating report in Supabase:', error);
      return null;
    }

    return updatedData;
  } catch (error) {
    console.error('Unexpected error updating report:', error);
    return null;
  }
};

/**
 * Confirm a report using the RPC function confirm_alert
 * This increases validations_count and prevents double confirmation by deviceId
 */
export const confirmReport = async (
  reportId: string,
  deviceId: string
): Promise<{ success: boolean; validations_count?: number; error?: string }> => {
  try {
    // Try to call the RPC function if it exists
    const { data, error } = await supabase.rpc('confirm_alert', {
      report_id: reportId,
      device_id: deviceId,
    });

    if (error) {
      console.error('Error calling confirm_alert RPC:', error);
      
      // Fallback: manually increment validations_count if RPC doesn't exist
      // This is less safe but provides basic functionality
      const { data: report, error: fetchError } = await supabase
        .from('reports')
        .select('validations_count')
        .eq('id', reportId)
        .single();

      if (fetchError) {
        return { success: false, error: 'Failed to fetch report' };
      }

      const { data: updatedReport, error: updateError } = await supabase
        .from('reports')
        .update({ validations_count: (report.validations_count || 0) + 1 })
        .eq('id', reportId)
        .select('validations_count')
        .single();

      if (updateError) {
        return { success: false, error: 'Failed to update report' };
      }

      return { 
        success: true, 
        validations_count: updatedReport.validations_count,
        error: 'RPC not available, used fallback (no double-confirmation protection)'
      };
    }

    return { success: true, validations_count: data };
  } catch (error) {
    console.error('Unexpected error confirming report:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

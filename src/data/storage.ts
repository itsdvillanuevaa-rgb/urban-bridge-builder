import type { Report } from "./mock";

const REPORTS_STORAGE_KEY = "urban_bridge_reports";

export const getReports = (): Report[] => {
  try {
    const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading reports from localStorage:", error);
    return [];
  }
};

export const saveReports = (reports: Report[]): void => {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error("Error saving reports to localStorage:", error);
  }
};

export const addReport = (report: Report): void => {
  const reports = getReports();
  reports.unshift(report); // Add to beginning of array
  saveReports(reports);
};

export const generateReportId = (): string => {
  return `R-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

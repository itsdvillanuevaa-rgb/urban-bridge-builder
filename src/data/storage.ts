import type { Report } from "./mock";

const REPORTS_STORAGE_KEY = "urban_bridge_reports";

// Mapping for old category values to new ones for backward compatibility
const categoryMapping: Record<string, string> = {
  "rampa-faltante": "falta-rampa",
  "banqueta-rota": "banqueta-danada",
  "obstaculo": "paso-obstruido",
  "semaforo": "cruce-peligroso",
  "bano": "paso-estrecho",
  "otro": "otro-problema",
};

const normalizeCategory = (category: string): string => {
  return categoryMapping[category] || category;
};

export const getReports = (): Report[] => {
  try {
    const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!stored) return [];
    const reports = JSON.parse(stored);
    // Add fallback for existing reports without severity and normalize old categories
    return reports.map((report: any) => ({
      ...report,
      category: normalizeCategory(report.category),
      severity: report.severity || "media",
    }));
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

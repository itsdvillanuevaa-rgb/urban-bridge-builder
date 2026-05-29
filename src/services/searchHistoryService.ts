import { SearchHistoryEntry } from "@/types/accessibility";

const HISTORY_KEY = "aa.search-history-v2"; // Using a separate key to avoid JSON parsing errors from old string history format
const MAX_HISTORY = 10;
const CDMX_CENTER: [number, number] = [19.4326, -99.1332];

export function getSearchHistory(): SearchHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading search history from localStorage:", error);
    return [];
  }
}

export function saveSearch(query: string, lat?: number, lon?: number): SearchHistoryEntry[] {
  if (typeof window === "undefined" || !query.trim()) {
    return getSearchHistory();
  }

  const cleanedQuery = query.trim();
  const history = getSearchHistory();

  const entryLat = lat !== undefined ? lat : CDMX_CENTER[0];
  const entryLon = lon !== undefined ? lon : CDMX_CENTER[1];

  const newEntry: SearchHistoryEntry = {
    query: cleanedQuery,
    lat: entryLat,
    lon: entryLon,
  };

  // Prepend the new search entry and filter out duplicate query names
  const updatedHistory = [
    newEntry,
    ...history.filter((item) => item.query.toLowerCase() !== cleanedQuery.toLowerCase()),
  ].slice(0, MAX_HISTORY);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error saving search history to localStorage:", error);
  }

  return updatedHistory;
}

export function removeSearch(query: string): SearchHistoryEntry[] {
  if (typeof window === "undefined") {
    return getSearchHistory();
  }

  const history = getSearchHistory().filter(
    (item) => item.query.toLowerCase() !== query.trim().toLowerCase()
  );

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error removing search history item:", error);
  }

  return history;
}

export function clearSearchHistory(): SearchHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
  return [];
}

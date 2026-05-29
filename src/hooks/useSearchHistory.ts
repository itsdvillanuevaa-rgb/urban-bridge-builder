import { useState, useEffect } from "react";
import * as historyService from "@/services/searchHistoryService";
import { SearchHistoryEntry } from "@/types/accessibility";

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(historyService.getSearchHistory());
  }, []);

  const saveQuery = (query: string, lat?: number, lon?: number) => {
    const updated = historyService.saveSearch(query, lat, lon);
    setHistory(updated);
  };

  const removeQuery = (query: string) => {
    const updated = historyService.removeSearch(query);
    setHistory(updated);
  };

  const clearHistory = () => {
    const updated = historyService.clearSearchHistory();
    setHistory(updated);
  };

  return {
    history,
    saveQuery,
    removeQuery,
    clearHistory,
  };
}

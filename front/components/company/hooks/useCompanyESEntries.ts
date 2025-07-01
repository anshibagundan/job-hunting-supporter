import { useEffect, useState } from "react";
import { fetchESByCompanyID, removeES, saveES } from "@/components/es/api";
import type { ESEntry } from "@/lib/supabase";

export function useCompanyESEntries(companyID: string) {
  const [entries, setEntries] = useState<ESEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyESEntries = async () => {
      if (!companyID) return;

      try {
        setIsLoading(true);
        const companyEntries = await fetchESByCompanyID(companyID);
        setEntries(companyEntries);
      } catch (error) {
        console.error("Failed to fetch company ES entries:", error);
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyESEntries();
  }, [companyID]);

  const addEntry = async (entry: ESEntry) => {
    try {
      const newEntry = await saveES(entry);
      setEntries((prev) => [...prev, newEntry]);
    } catch (error) {
      console.error("Failed to add ES entry:", error);
      throw error;
    }
  };

  const updateEntry = async (updatedEntry: ESEntry) => {
    try {
      const updated = await saveES(updatedEntry);
      setEntries((prev) =>
        prev.map((entry) => (entry.id === updatedEntry.id ? updated : entry))
      );
    } catch (error) {
      console.error("Failed to update ES entry:", error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await removeES(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Failed to delete ES entry:", error);
      throw error;
    }
  };

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}

import { useEffect, useState } from "react";
import { fetchESByUserID, removeES, saveES } from "@/components/es/api";
import type { ESEntry } from "@/lib/supabase";

export function useESEntries(userID: string) {
  const [entries, setEntries] = useState<ESEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ESEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userID) {
      setIsLoading(false);
      return;
    }

    const fetchInitialEntries = async () => {
      try {
        setIsLoading(true);
        const initialEntries = await fetchESByUserID(userID);
        setEntries(initialEntries);
      } catch (error) {
        console.error("Failed to fetch ES entries:", error);
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialEntries();
  }, [userID]);

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

  const selectEntry = (entry: ESEntry | null) => {
    setSelectedEntry(entry);
  };

  return {
    entries,
    selectedEntry,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    selectEntry,
  };
}

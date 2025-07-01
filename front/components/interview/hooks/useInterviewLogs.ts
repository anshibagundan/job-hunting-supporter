import { useCallback, useEffect, useState } from "react";
import {
  fetchAllInterviews,
  removeInterview,
  saveInterview,
} from "@/components/interview/api";
import type { InterviewLog } from "@/lib/supabase";

export function useInterviewLogs() {
  const [logs, setLogs] = useState<InterviewLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<InterviewLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const fetchedLogs = await fetchAllInterviews();
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Failed to load interview logs:", error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  const addLog = useCallback(async (newLog: InterviewLog) => {
    try {
      const savedLog = await saveInterview(newLog);
      setLogs((prev) => [...prev, savedLog]);
    } catch (error) {
      console.error("Failed to add interview log:", error);
      throw error;
    }
  }, []);

  const updateLog = useCallback(async (updatedLog: InterviewLog) => {
    try {
      const updated = await saveInterview(updatedLog);
      setLogs((prev) =>
        prev.map((log) => (log.id === updatedLog.id ? updated : log))
      );
    } catch (error) {
      console.error("Failed to update interview log:", error);
      throw error;
    }
  }, []);

  const deleteLog = useCallback(
    async (id: string) => {
      try {
        await removeInterview(id);
        setLogs((prev) => prev.filter((log) => log.id !== id));

        if (selectedLog?.id === id) {
          setSelectedLog(null);
        }
      } catch (error) {
        console.error("Failed to delete interview log:", error);
        throw error;
      }
    },
    [selectedLog]
  );

  const selectLog = useCallback((log: InterviewLog) => {
    setSelectedLog(log);
  }, []);

  return {
    logs,
    selectedLog,
    isLoading,
    addLog,
    updateLog,
    deleteLog,
    selectLog,
  };
}

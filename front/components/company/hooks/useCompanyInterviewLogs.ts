import { useEffect, useState } from "react";
import {
  fetchInterviewsByCompanyID,
  removeInterview,
  saveInterview,
} from "@/components/interview/api";
import type { InterviewLog } from "@/lib/supabase";

export function useCompanyInterviewLogs(companyID: string) {
  const [logs, setLogs] = useState<InterviewLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyInterviewLogs = async () => {
      if (!companyID) return;

      try {
        setIsLoading(true);
        const companyLogs = await fetchInterviewsByCompanyID(companyID);
        setLogs(companyLogs);
      } catch (error) {
        console.error("Failed to fetch company Interview Logs:", error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyInterviewLogs();
  }, [companyID]);

  const addLog = async (log: InterviewLog) => {
    try {
      const newLogs = await saveInterview(log);
      setLogs((prev) => [...prev, newLogs]);
    } catch (error) {
      console.error("Failed to add Interview log:", error);
      throw error;
    }
  };

  const updateLog = async (updatedLog: InterviewLog) => {
    try {
      const updated = await saveInterview(updatedLog);
      setLogs((prev) =>
        prev.map((log) => (log.id === updatedLog.id ? updated : log))
      );
    } catch (error) {
      console.error("Failed to update Interview Log:", error);
      throw error;
    }
  };

  const deleteLog = async (id: string) => {
    try {
      await removeInterview(id);
      setLogs((prev) => prev.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Failed to delete Interview log:", error);
      throw error;
    }
  };

  return {
    logs,
    isLoading,
    addLog,
    updateLog,
    deleteLog,
  };
}

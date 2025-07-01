import { useEffect, useState } from "react";
import {
  fetchJobEventsByCompanyID,
  type JobEventResponse,
} from "../../job-events/api";

export function useCompanyJobEvents(companyID: string) {
  const [jobEvents, setJobEvents] = useState<JobEventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyJobEvents = async () => {
      if (!companyID) return;

      try {
        setIsLoading(true);
        const events = await fetchJobEventsByCompanyID(companyID);
        setJobEvents(events);
      } catch (error) {
        console.error("Failed to fetch company job events:", error);
        setJobEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyJobEvents();
  }, [companyID]);

  return {
    jobEvents,
    isLoading,
    refetch: () => {
      if (companyID) {
        fetchJobEventsByCompanyID(companyID).then(setJobEvents);
      }
    },
  };
}

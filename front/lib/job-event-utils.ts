import { JobEventResponse } from "@/components/job-events/api"
import { Event } from "@/lib/supabase"

export const jobEventToEvent = (jobEvent: JobEventResponse, companyName: string): Event => {
  // 締切日をイベント日として使用
  const eventDate = new Date(jobEvent.Deadline)

  return {
    id: `job-event-${jobEvent.ID}`,
    company_id: jobEvent.CompanyID,
    company_name: companyName,
    type: jobEvent.JobType === "説明会" ? "説明会" :
          jobEvent.JobType === "面接" ? "面接" : "その他",
    title: jobEvent.JobTitle,
    date: eventDate.toISOString().split('T')[0], // YYYY-MM-DD format
    time: eventDate.toTimeString().slice(0, 5), // HH:MM format
    notes: `${jobEvent.JobDescription}\n\n応募開始: ${new Date(jobEvent.StartDate).toLocaleDateString()}\n締切: ${new Date(jobEvent.Deadline).toLocaleDateString()}\nURL: ${jobEvent.EventURL}`,
    // JobEvent固有の情報を保持
    job_title: jobEvent.JobTitle,
    job_type: jobEvent.JobType,
    job_description: jobEvent.JobDescription,
    start_date: jobEvent.StartDate,
    deadline: jobEvent.Deadline,
    event_url: jobEvent.EventURL,
    isJobEvent: true
  }
}

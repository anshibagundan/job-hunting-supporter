import { JobEventResponse } from "@/components/job-events/api"
import { Event } from "@/lib/supabase"

export const jobEventToEvent = (jobEvent: JobEventResponse, companyName: string): Event => {
  // 締切日をイベント日として使用
  const eventDate = new Date(jobEvent.deadline)

  return {
    id: `job-event-${jobEvent.id}`,
    company_id: jobEvent.company_id,
    company_name: companyName,
    type: jobEvent.job_type === "説明会" ? "説明会" :
          jobEvent.job_type === "面接" ? "面接" : "その他",
    title: jobEvent.job_title,
    date: eventDate.toISOString().split('T')[0], // YYYY-MM-DD format
    time: eventDate.toTimeString().slice(0, 5), // HH:MM format
    notes: `${jobEvent.job_description}\n\n応募開始: ${new Date(jobEvent.start_date).toLocaleDateString()}\n締切: ${new Date(jobEvent.deadline).toLocaleDateString()}\nURL: ${jobEvent.event_url}`,
    // JobEvent固有の情報を保持
    job_title: jobEvent.job_title,
    job_type: jobEvent.job_type,
    job_description: jobEvent.job_description,
    start_date: jobEvent.start_date,
    deadline: jobEvent.deadline,
    event_url: jobEvent.event_url,
    isJobEvent: true
  }
}

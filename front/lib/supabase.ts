// API client utilities and interfaces
export interface Company {
  id: string
  name: string
  events: Event[]
}

export interface Event {
  id: string
  company_id: string
  company_name: string
  type: "ES締切" | "面接" | "説明会" | "その他"
  title: string
  date: string
  time?: string
  notes?: string
}

export interface ESEntry {
  id: string
  company_name: string
  title: string
  content: string
  summary?: string
  advice?: string
  created_at: string
}

export interface InterviewLog {
  id: string
  company_name: string
  date: string
  transcript?: string
  summary?: string
  questions?: string[]
  created_at: string
}

// TODO: 将来のAPI実装用
// 現在は一時的にローカルストレージを使用
export const storage = {
  getEvents: (): Event[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("job-hunting-events")
    return data ? JSON.parse(data) : []
  },

  saveEvents: (events: Event[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("job-hunting-events", JSON.stringify(events))
  },

  getESEntries: (): ESEntry[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("job-hunting-es")
    return data ? JSON.parse(data) : []
  },

  saveESEntries: (entries: ESEntry[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("job-hunting-es", JSON.stringify(entries))
  },

  getInterviewLogs: (): InterviewLog[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("job-hunting-interviews")
    return data ? JSON.parse(data) : []
  },

  saveInterviewLogs: (logs: InterviewLog[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("job-hunting-interviews", JSON.stringify(logs))
  },
}

import { fetchAllCompanies, convertCompanyToFrontend } from '@/components/company/api';

// API client utilities and interfaces
export interface Company {
  id: string
  name: string
  industry: string
  image?: string
  description?: string
  website?: string
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
  company: Company
  title: string
  content: string
  summary?: string
  advice?: string
  created_at: string
}

export interface InterviewLog {
  id: string
  company: Company
  jobEventId: string
  userId: string
  interviewAt: string
  stage?: string
  location?: string
  meetingUrl?: string

  audioFile?: File
  transcript?: string

  audioSummary?: string
  textNote?: string

  createdAt: string
  updatedAt: string
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


  getCompanies: async (): Promise<Company[]> => {
    if (typeof window === "undefined") return []
    try {
      // APIから企業データを取得
      const backendCompanies = await fetchAllCompanies();
      const companies = backendCompanies.map(convertCompanyToFrontend);

      // ローカルストレージにキャッシュとして保存
      localStorage.setItem("job-hunting-companies", JSON.stringify(companies));
      return companies;
    } catch (error) {
      console.error('Failed to fetch companies from API:', error);
      return [];
    }
  },
}

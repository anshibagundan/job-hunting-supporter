import { fetchAllCompanies, type CompanyResponse } from '@/components/company/api';

// API client utilities and interfaces
export interface Company {
  id: number
  name: string
  industry: string
  image: string
  description: string
  website: string
  events: Event[]
}

export interface Event {
  id: string
  company_id: number
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
  company_name: string
  date: string
  transcript?: string
  summary?: string
  questions?: string[]
  created_at: string
}

export interface UserDetails {
  id: string
  name: string
  email: string
  photo_url?: string
  created_at: string
  updated_at: string
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

  getInterviewLogs: (): InterviewLog[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("job-hunting-interviews")
    return data ? JSON.parse(data) : []
  },

  saveInterviewLogs: (logs: InterviewLog[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("job-hunting-interviews", JSON.stringify(logs))
  },

  getCompanies: async (): Promise<Company[]> => {
    if (typeof window === "undefined") return []
    try {
      // APIから企業データを取得
      const backendCompanies = await fetchAllCompanies();
      const companies: Company[] = backendCompanies.map(company => ({
        ...company,
        events: [] // デフォルトで空配列
      }));
      return companies;
    } catch (error) {
      console.error('Failed to fetch companies from API:', error);
      return [];
    }
  },
}

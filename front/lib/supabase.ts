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
    if (data) {
      return JSON.parse(data)
    }
    return []
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

  getCompanies: (): Company[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("job-hunting-companies")
    if (data) {
      return JSON.parse(data)
    }
    // デフォルトの企業データ
    const defaultCompanies: Company[] = [
      {
        id: "1",
        name: "テック株式会社",
        industry: "IT・ソフトウェア",
        image: "/placeholder.jpg",
        description: "革新的なWebサービスを開発するテクノロジー企業です。",
        website: "https://example-tech.com",
        events: []
      },
      {
        id: "2",
        name: "グローバル商事",
        industry: "商社・貿易",
        image: "/placeholder.jpg",
        description: "国際的な商取引を行う総合商社です。",
        website: "https://example-trading.com",
        events: []
      },
      {
        id: "3",
        name: "メディア・コミュニケーションズ",
        industry: "メディア・広告",
        image: "/placeholder.jpg",
        description: "デジタルマーケティングとコンテンツ制作を行う企業です。",
        website: "https://example-media.com",
        events: []
      },
      {
        id: "4",
        name: "ファイナンス・パートナーズ",
        industry: "金融・保険",
        image: "/placeholder.jpg",
        description: "革新的な金融サービスを提供するフィンテック企業です。",
        website: "https://example-finance.com",
        events: []
      }
    ]
    localStorage.setItem("job-hunting-companies", JSON.stringify(defaultCompanies))
    return defaultCompanies
  },

  saveCompanies: (companies: Company[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("job-hunting-companies", JSON.stringify(companies))
  },
}

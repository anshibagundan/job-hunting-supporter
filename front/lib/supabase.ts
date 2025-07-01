import {
  convertCompanyToFrontend,
  fetchAllCompanies,
} from "@/components/company/api";

// API client utilities and interfaces
export interface Company {
  id: string;
  name: string;
  industry: string;
  image: string;
  description: string;
  website: string;
  events: Event[];
}

export interface Event {
  id: string;
  company_id: number;
  company_name: string;
  type: "ES締切" | "面接" | "説明会" | "その他";
  title: string;
  date: string;
  time?: string;
  notes?: string;
  // JobEventから来るデータ用の追加フィールド
  job_title?: string;
  job_type?: string;
  job_description?: string;
  start_date?: string;
  deadline?: string;
  event_url?: string;
  isJobEvent?: boolean; // JobEventから来たデータかどうかを識別
}

export interface AdviceItem {
  category: string;
  achievement: number;
  reason: string;
  suggestion: string;
}

export interface ESEntry {
  id: string;
  company: Company;
  title: string;
  content: string;
  summary?: string;
  advice?: string;
  adviceItems?: AdviceItem[];
  created_at: string;
}

export interface InterviewLog {
  id: string;
  company: Company;
  jobEventId: string;
  userId: string;
  interviewAt: string;
  stage?: string;
  location?: string;
  meetingUrl?: string;

  audioFile?: File | null; // 音声ファイルはオプション
  transcript?: string;

  audioSummary?: string;
  textNote?: string;

  createdAt: string;
  updatedAt: string;
}

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

// TODO: 将来のAPI実装用
// 現在はJobEvent APIを使用してイベントを管理
export const storage = {
  getCompanies: async (): Promise<Company[]> => {
    if (typeof window === "undefined") return [];
    try {
      // APIから企業データを取得
      const backendCompanies = await fetchAllCompanies();
      return backendCompanies.map(convertCompanyToFrontend);
    } catch (error) {
      console.error("Failed to fetch companies from API:", error);
      return [];
    }
  },
};

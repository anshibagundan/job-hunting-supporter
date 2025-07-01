import type { Company } from "@lib/supabase";
import apiClient from "@/lib/api-client";

// 企業の型定義（バックエンドのレスポンス形式）
export interface CompanyResponse {
  id: number;
  name: string;
  website: string;
  description: string;
  image: string;
  industry: string;
  scrape_target_url: string;
  last_scrape_time: string;
  created_at: string;
  updated_at: string;
}

export const convertCompanyToFrontend = (
  backendCompany: CompanyResponse
): Company => {
  return {
    id: backendCompany.id.toString(),
    name: backendCompany.name,
    website: backendCompany.website,
    description: backendCompany.description,
    image: backendCompany.image || "",
    industry: backendCompany.industry || "",
    events: [], // イベントは別途取得する必要がある場合に対応
  };
};

// 全ての企業を取得
export const fetchAllCompanies = async (): Promise<CompanyResponse[]> => {
  const response = await apiClient.get("/companies");
  return response.data;
};

// 企業IDで個別企業を取得
export const fetchCompanyById = async (
  id: string
): Promise<CompanyResponse> => {
  const response = await apiClient.get(`/companies/${id}`);
  return response.data;
};

// 企業作成用の型定義
export interface CreateCompanyRequest {
  name: string;
  website: string;
  description: string;
  image: string;
  industry: string;
  scrape_target_url: string;
}

// 企業作成
export const createCompany = async (data: CreateCompanyRequest) => {
  const response = await apiClient.post("/companies", data);
  return response.data;
};

// 企業更新
export const updateCompany = async (data: CompanyResponse) => {
  const response = await apiClient.put("/companies", data);
  return response.data;
};

// 企業削除
export const deleteCompany = async (id: string) => {
  const response = await apiClient.delete(`/companies/${id}`);
  return response.data;
};

// 企業情報生成用の型定義
export interface GenerateCompanyRequest {
  name: string;
}

// 企業情報自動生成
export const generateCompanyInfo = async (
  companyName: string
): Promise<CompanyResponse> => {
  const response = await apiClient.post("/companies/generate", {
    name: companyName,
  });
  return response.data;
};

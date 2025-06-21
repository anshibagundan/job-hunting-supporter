import apiClient from '@/lib/api-client';

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

// 全ての企業を取得
export const fetchAllCompanies = async (): Promise<CompanyResponse[]> => {
  const response = await apiClient.get('/companies');
  return response.data;
};

// 企業IDで個別企業を取得
export const fetchCompanyById = async (id: string): Promise<CompanyResponse> => {
  const response = await apiClient.get(`/companies/${id}`);
  return response.data;
};

// 企業作成
export const createCompany = async (data: Omit<CompanyResponse, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'LastScrapeTime'>) => {
  const response = await apiClient.post('/companies', data);
  return response.data;
};

// 企業更新
export const updateCompany = async (data: CompanyResponse) => {
  const response = await apiClient.put('/companies', data);
  return response.data;
};

// 企業削除
export const deleteCompany = async (id: string) => {
  const response = await apiClient.delete(`/companies/${id}`);
  return response.data;
};

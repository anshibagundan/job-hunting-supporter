import apiClient from '@/lib/api-client';

// 企業の型定義（フロントエンド用）
export interface CompanyResponse {
  ID: number;
  Name: string;
  WebURL: string;
  Description: string;
  Img: string;
  Industry: string;
  ScrapeTargetURL: string;
  LastScrapeTime: string;
  CreatedAt: string;
  UpdatedAt: string;
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

// バックエンドのレスポンスをフロントエンドの形式に変換
export const convertCompanyToFrontend = (backendCompany: CompanyResponse) => {
  return {
    id: backendCompany.ID.toString(),
    name: backendCompany.Name,
    industry: backendCompany.Industry,
    image: backendCompany.Img,
    description: backendCompany.Description,
    website: backendCompany.WebURL,
    events: [] // デフォルトで空配列
  };
};

import apiClient from '@/lib/api-client';

// 個別のES取得
export const fetchES = async (id: string) => {
  const response = await apiClient.get(`/company-es/${id}`);
  return response.data;
};

// 全てのES取得
export const fetchAllES = async () => {
  const response = await apiClient.get('/company-es');
  return response.data;
};

// ユーザーIDによるES取得
export const fetchESByUserID = async (userID: string) => {
  const response = await apiClient.get(`/company-es/user/${userID}`);
  return response.data;
};

// 企業IDによるES取得
export const fetchESByCompanyID = async (companyID: string) => {
  const response = await apiClient.get(`/company-es/company/${companyID}`);
  return response.data;
};

// ユーザーIDと企業IDによるES取得
export const fetchESByUserIDAndCompanyID = async (userID: string, companyID: string) => {
  const response = await apiClient.get(`/company-es/user/${userID}/company/${companyID}`);
  return response.data;
};

export const createES = async (data: any) => {
  // フロントエンドのデータ構造をバックエンドの期待する形式に変換
  const backendData = {
    user_id: parseInt(data.user_id || "1"), // 現在はハードコーディング、認証実装後に変更
    company_id: data.company.id, // 既にnumber型なのでparseIntは不要
    title: data.title || "",
    content: data.content,
    summary: data.summary || "",
    advice: data.advice || "",
    advice_items: data.adviceItems || []
  };

  const response = await apiClient.post('/company-es', backendData);
  return response.data;
};

export const updateES = async (id: string, data: any) => {
  // フロントエンドのデータ構造をバックエンドの期待する形式に変換
  const backendData = {
    id: parseInt(id),
    user_id: parseInt(data.user_id || "1"), // 現在はハードコーディング、認証実装後に変更
    company_id: data.company.id, // 既にnumber型なのでparseIntは不要
    title: data.title || "",
    content: data.content,
    summary: data.summary || "",
    advice: data.advice || "",
    advice_items: data.adviceItems || []
  };

  const response = await apiClient.put(`/company-es/${id}`, backendData);
  return response.data;
};

export const deleteES = async (id: string) => {
  const response = await apiClient.delete(`/company-es/${id}`);
  return response.data;
};

export const saveES = async (data: any) => {
  if (data.id) {
    return updateES(data.id, data);
  } else {
    return createES(data);
  }
};

export const removeES = async (id: string) => {
  return deleteES(id);
};

// ES自動生成
export const generateESContent = async (baseES: string, companyDescription: string, esTitle: string) => {
  const requestData = {
    base_es: baseES,
    company_description: companyDescription,
    es_title: esTitle
  };

  const response = await apiClient.post('/company-es/generate', requestData);
  return response.data;
};

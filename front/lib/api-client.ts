import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true, // Cookieを含めてリクエストを送信
});

// リクエストインターセプターでヘッダーを動的に設定
apiClient.interceptors.request.use((config) => {
  // FormDataの場合はContent-Typeを設定しない（ブラウザが自動設定）
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    // それ以外の場合はapplication/jsonを設定
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Wrapper methods for easier usage
export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await apiClient.get(url);
    return response.data;
  },
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post(url, data);
    return response.data;
  },
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put(url, data);
    return response.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete(url);
    return response.data;
  },
};

export { apiClient };
export default apiClient;

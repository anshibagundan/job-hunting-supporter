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

export default apiClient;

import axios from 'axios';
import {API_BASE_URL} from '@/config.js';
import { logout } from '@/utils/auth'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && (error.response.status === 401 ||error.response.status === 302 )&& !originalRequest._retry) {
      console.log('AccessToken 만료 → 자동 refresh 시도');

      originalRequest._retry = true;

      try {
        // 1. refresh 요청
        await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });

        // 2. refresh 성공 -> 원래 요청 다시 재시도
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('RefreshToken 만료 → 로그아웃 처리');
        logout(); 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

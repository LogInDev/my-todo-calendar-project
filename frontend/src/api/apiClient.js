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

    if (error.response) {
      const { status, data } = error.response;

      // 403 이면서 "Invalid JWT" 같은 에러메시지가 있다면 바로 로그아웃
      if (status === 403 && data?.message?.includes('Invalid JWT')) {
        console.error('Invalid JWT → 바로 로그아웃 처리');
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // 401, 302는 refresh 시도
      if ((status === 401 || status === 302) && !originalRequest._retry) {
        console.log('AccessToken 만료 → 자동 refresh 시도');

        originalRequest._retry = true;

        try {
          // refresh token 요청
          await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
          // refresh 성공하면 원래 요청 재시도
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('RefreshToken 만료 → 로그아웃 처리');
          logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export const logout = () => {
  // 1. access_token, refresh_token 쿠키 삭제
  document.cookie = 'ACCESS_TOKEN=; Max-Age=0; path=/';
  document.cookie = 'REFRESH_TOKEN=; Max-Age=0; path=/';

  // 2. 강제 리다이렉트
  window.location.href = '/login';
};

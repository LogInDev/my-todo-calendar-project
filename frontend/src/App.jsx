import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';
// React DnD
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// React Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Components
import MainPage from '@/pages/index/index';
import LoginPage from '@/pages/login/LoginPage';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/users/me`, {
      withCredentials: true,
    })
      .then((res) => {
        console.log('로그인 유저:', res.data);
        setIsAuthenticated(true); // 인증 성공
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          console.log('로그인 안됨');
          setIsAuthenticated(false); // 인증 실패
        } else {
          console.error('API 호출 오류:', err);
          setIsAuthenticated(false);
        }
      });
  }, []);

  // if (isAuthenticated === null) {
  //   return <div>로딩중...</div>; // 아직 로그인 여부 모를 때
  // }

  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <MainPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
        </Routes>
      </BrowserRouter>
    </DndProvider>
  );
};

export default App;

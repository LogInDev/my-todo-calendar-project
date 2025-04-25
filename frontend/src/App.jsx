import React from 'react';
// Components
import MainPage from '@pages/index/index';
import LoginPage from './pages/login/LoginPage';
// React DnD
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </DndProvider>

  )
};

export default App;

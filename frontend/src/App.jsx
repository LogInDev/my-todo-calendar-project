import React, { useState } from 'react';
import MainPage from '@pages/index/index';
// CSS
import 'antd/dist/antd.variable.min.css'; // ✅ variable 스타일 사용해야 동적 테마 적용 가능s

const App = () => {

  // 다크모드 여부
  const [darkMode, setDarkMode] = useState(false);

  return (
    <MainPage />

  )
};

export default App;

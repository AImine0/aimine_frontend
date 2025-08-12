// [앱 엔트리] 라우터 및 페이지 진입점 (기능별/직업별 페이지 라우팅)
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeatureListPage from './pages/FeatureListPage';
import RoleListPage from './pages/RoleListPage';
import ToolDetailPage from './pages/ToolDetailPage';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FeatureListPage />} />
        <Route path="/role" element={<RoleListPage />} />
        <Route path="/tool/:id" element={<ToolDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
// [앱 엔트리] 라우터 및 페이지 진입점 (기능별/직업별/검색/마이페이지 라우팅)

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import FeatureListPage from './pages/FeatureListPage';
import RoleListPage from './pages/RoleListPage';
import ToolDetailPage from './pages/ToolDetailPage';
import SearchPage from './pages/SearchPage';
import MyPage from './pages/MyPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 공개 페이지들 */}
          <Route path="/" element={<FeatureListPage />} />
          <Route path="/role" element={<RoleListPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tool/:id" element={<ToolDetailPage />} />
          
          {/* 인증이 필요한 페이지들 */}
          <Route 
            path="/mypage" 
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
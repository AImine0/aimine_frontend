// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import FeatureListPage from './pages/FeatureListPage';
import HomePage from './pages/HomePage';
import RoleListPage from './pages/RoleListPage';
import ToolDetailPage from './pages/ToolDetailPage';
import SearchPage from './pages/SearchPage';
import MyPage from './pages/MyPage';
import AuthCallbackPage from './pages/AuthCallbackPage'; // 새로 추가

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 공개 페이지들 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeatureListPage />} />
          <Route path="/role" element={<RoleListPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tool/:id" element={<ToolDetailPage />} />
          
          {/* OAuth 콜백 페이지 */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
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
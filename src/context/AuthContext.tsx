// [인증 컨텍스트] 전역 인증 상태 관리 - 로그인/로그아웃, 사용자 정보

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService } from '../services';
import type { UserProfileResponse } from '../types';

interface AuthContextType {
  // 상태
  isAuthenticated: boolean;
  user: UserProfileResponse | null;
  loading: boolean;
  
  // 액션
  login: (googleToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 인증 상태 확인 함수
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          const userProfile = await apiService.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          // 토큰이 유효하지 않은 경우 로그아웃 처리
          await handleLogout();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 로그인 함수
  const login = async (googleToken: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await apiService.loginWithGoogle(googleToken);
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser({
          id: response.user.id,
          google_id: response.user.google_id,
          email: response.user.email,
          name: response.user.name,
          role: 'USER',
          created_at: new Date().toISOString()
        });
        
        return true;
      } else {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
      // API 호출이 실패해도 로컬 상태는 초기화
    } finally {
      await handleLogout();
    }
  };

  // 로컬 로그아웃 처리
  const handleLogout = async (): Promise<void> => {
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
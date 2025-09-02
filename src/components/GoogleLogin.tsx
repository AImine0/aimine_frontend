// src/components/GoogleLogin.tsx
import React, { useState } from 'react';

interface GoogleLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({
  onSuccess,
  onError,
  className = '',
  children
}) => {
  const [loading, setLoading] = useState(false);

  // 백엔드 OAuth URL로 리다이렉트
  const handleGoogleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);
      
      // 백엔드의 OAuth2 인증 URL로 리다이렉트
      // 성공 시 /auth/callback으로 토큰과 함께 돌아옴
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      console.error('Google 로그인 오류:', error);
      onError?.(errorMsg);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`
        flex items-center justify-center gap-3 px-6 py-3 
        bg-white border border-gray-300 rounded-lg 
        hover:bg-gray-50 hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 font-medium text-gray-700
        ${className}
      `}
      style={{ fontFamily: 'Pretendard' }}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span>로그인 중...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {children || 'Google로 로그인'}
        </>
      )}
    </button>
  );
};

export default GoogleLogin;
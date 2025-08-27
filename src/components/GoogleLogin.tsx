// [Google 로그인] OAuth 인증 처리 - Google 계정으로 로그인

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // 실제 Google OAuth 구현을 위한 준비
  const handleGoogleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // TODO: 실제 Google OAuth 구현
      // 현재는 데모용 로직
      const confirmLogin = window.confirm(
        '데모 모드입니다.\n\n실제 Google OAuth는 백엔드 설정이 필요합니다.\n\n데모 로그인을 진행하시겠습니까?'
      );

      if (!confirmLogin) {
        setLoading(false);
        return;
      }

      // 데모용 가짜 Google 토큰
      const demoGoogleToken = 'demo_google_token_' + Date.now();
      
      const success = await login(demoGoogleToken);
      
      if (success) {
        onSuccess?.();
      } else {
        const errorMsg = '로그인에 실패했습니다. 다시 시도해주세요.';
        onError?.(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      console.error('Google 로그인 오류:', error);
      onError?.(errorMsg);
      alert(`로그인 오류: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // 실제 Google OAuth SDK를 사용할 때의 준비 코드
  // useEffect(() => {
  //   // Google OAuth SDK 로드
  //   const loadGoogleSDK = () => {
  //     if (window.google) return;
      
  //     const script = document.createElement('script');
  //     script.src = 'https://accounts.google.com/gsi/client';
  //     script.async = true;
  //     script.defer = true;
  //     document.head.appendChild(script);
      
  //     script.onload = () => {
  //       window.google.accounts.id.initialize({
  //         client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  //         callback: handleCredentialResponse
  //       });
  //     };
  //   };

  //   loadGoogleSDK();
  // }, []);

  // const handleCredentialResponse = async (response: any) => {
  //   try {
  //     setLoading(true);
  //     const success = await login(response.credential);
      
  //     if (success) {
  //       onSuccess?.();
  //     } else {
  //       throw new Error('로그인 처리 실패');
  //     }
  //   } catch (error) {
  //     const errorMsg = error instanceof Error ? error.message : '로그인에 실패했습니다.';
  //     onError?.(errorMsg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
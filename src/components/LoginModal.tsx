// [로그인 모달] 구글 로그인 진입 모달 
import React from 'react';
import GoogleLogin from './GoogleLogin';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ fontFamily: 'Pretendard' }}>
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* 모달 박스 */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[26rem] mx-4 px-4 py-10">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="닫기"
        >
          <img src="/images/Icon/Delete/24.svg" alt="닫기" width={24} height={24} />
        </button>

        {/* 로고 */}
        <div className="flex justify-center mb-12">
          <img src="/logo.svg" alt="AIMine" style={{ width: '160px', height: '34px' }} />
        </div>

        {/* 타이틀 */}
        <h2 className="text-center -mt-2 mb-4" style={{ fontWeight: 600, color: '#202020', fontSize: '16px' }}>
          다음 계정으로 로그인
        </h2>

        {/* 구글 로그인 버튼 */}
        <div className="flex justify-center">
          <GoogleLogin
            className="w-full max-w-xs h-14 px-2 py-3 border-[#BCBCBC] rounded-[12px]"
          >
            <span className="flex items-center gap-4">
              {/* 버튼 내부 기본 아이콘은 컴포넌트에서 렌더링됨 */}
              <span className="text-[18px]" style={{ fontWeight: 400, color: '#202020' }}>구글로 로그인</span>
            </span>
          </GoogleLogin>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;


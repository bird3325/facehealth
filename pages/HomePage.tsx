import React, { useRef, useState } from 'react';
import { Page } from '../types';
import { CameraIcon, UploadIcon, GroupIcon, MenuIcon } from '../components/Icons';

interface HomePageProps {
  onStartAnalysis: (file: File) => Promise<void>;
  onNavigate: (page: Page) => void;
  error?: string | null;
  clearError?: () => void;
  isLoading?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ 
  onStartAnalysis, 
  onNavigate, 
  error, 
  clearError,
  isLoading = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 디바이스 타입 감지
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // 파일 선택 처리 - 파일 검증 강화
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 파일 선택 이벤트 발생');
    
    const file = event.target.files?.[0];
    
    if (!file) {
      console.warn('⚠️ 선택된 파일이 없습니다.');
      alert('⚠️ 파일 선택 오류\n\n파일이 선택되지 않았습니다.\n다시 시도해주세요.');
      return;
    }

    console.log('📷 선택된 파일:', {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)}KB`,
      type: file.type,
      lastModified: new Date(file.lastModified).toLocaleString()
    });

    // 에러 초기화
    if (clearError) {
      clearError();
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      console.error('❌ 이미지 파일이 아님:', file.type);
      alert('⚠️ 파일 형식 오류\n\n이미지 파일만 업로드 가능합니다.\n\nJPEG, PNG, WebP 등의 이미지를 선택해주세요.');
      return;
    }

    // 파일 크기 확인 (20MB 제한)
    if (file.size > 20 * 1024 * 1024) {
      console.error('❌ 파일 크기 초과:', `${(file.size / 1024 / 1024).toFixed(1)}MB`);
      alert('⚠️ 파일 크기 오류\n\n파일이 너무 큽니다.\n20MB 이하의 이미지를 선택해주세요.');
      return;
    }

    // 최소 크기 확인 (1KB 이상)
    if (file.size < 1024) {
      console.error('❌ 파일이 너무 작음:', file.size + 'bytes');
      alert('⚠️ 파일 크기 오류\n\n파일이 너무 작습니다.\n올바른 이미지 파일을 선택해주세요.');
      return;
    }

    try {
      console.log('🚀 분석 시작 - 파일 전달');
      // 파일을 분석 함수에 전달
      await onStartAnalysis(file);
    } catch (error) {
      console.error('❌ 분석 시작 오류:', error);
      alert('❌ 분석 시작 오류\n\n분석을 시작할 수 없습니다.\n다시 시도해주세요.');
    }
    
    // 파일 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 카메라/파일 선택 버튼 클릭 처리
  const handleCameraUploadClick = () => {
    if (isLoading) {
      console.warn('⚠️ 분석 진행 중 - 버튼 비활성화됨');
      return;
    }

    if (fileInputRef.current) {
      console.log('📁 파일 선택 창 열기');
      fileInputRef.current.click();
    } else {
      console.error('❌ 파일 input 참조 없음');
      alert('❌ 시스템 오류\n\n파일 선택 기능을 초기화할 수 없습니다.\n페이지를 새로고침 해주세요.');
    }
  };

  // 메뉴 관련 함수들
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const handleMenuItemClick = (action: () => void) => {
    action();
    closeMenu();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-noto-sans-kr relative">
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        capture={isMobile ? "user" : undefined}
        style={{ display: 'none' }}
        disabled={isLoading}
      />

      {/* 메뉴 오버레이 */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* 슬라이드 메뉴 */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* 메뉴 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">메뉴</h2>
            <button 
              onClick={closeMenu}
              className="p-2 hover:bg-gray-100 rounded"
              aria-label="메뉴 닫기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메뉴 내용 */}
          <div className="flex-grow p-4">
            <nav className="space-y-2">
              <button
                onClick={() => handleMenuItemClick(() => onNavigate(Page.Home))}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-xl">🏠</span>
                <span className="text-gray-900 font-medium">홈</span>
              </button>

              <button
                onClick={() => handleMenuItemClick(handleCameraUploadClick)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <span className="text-xl">📸</span>
                <span className="text-gray-900 font-medium">건강 스캔</span>
              </button>

              {/* 주석처리된 메뉴 항목들
              <button
                onClick={() => handleMenuItemClick(() => onNavigate(Page.SharingCenter))}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-xl">👥</span>
                <span className="text-gray-900 font-medium">공유 센터</span>
              </button>

              <button
                onClick={() => handleMenuItemClick(() => onNavigate(Page.SharingSettings))}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-xl">⚙️</span>
                <span className="text-gray-900 font-medium">설정</span>
              </button>

              <div className="border-t border-gray-200 my-4"></div>

              <button
                onClick={() => handleMenuItemClick(() => console.log('도움말 클릭'))}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-xl">❓</span>
                <span className="text-gray-900 font-medium">도움말</span>
              </button>
              */}
            </nav>
          </div>

          {/* 메뉴 푸터 - 앱 정보 */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center text-gray-500 text-xs space-y-2">
              <div>
                <p className="font-semibold text-gray-700">FaceDoc</p>
                <p>버전 1.0.0</p>
              </div>
              
              <div className="border-t border-gray-200 pt-2">
                <p>© 2025 페이스닥</p>
                <p>All rights reserved.</p>
              </div>
              
              <div className="border-t border-gray-200 pt-2">
                <p className="font-medium text-gray-600">제휴·광고 문의</p>
                <a 
                  href="mailto:bird3325@gmail.com"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  bird3325@gmail.com
                </a>
              </div>
              
              <div className="pt-2">
                <p className="flex items-center justify-center gap-1">
                  <span>건강한 하루 되세요!</span>
                  <span>😊</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상단 메뉴바 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          페이스닥
        </div>
        <button 
          onClick={toggleMenu}
          aria-label="메뉴 열기" 
          className="p-2 hover:bg-gray-100 rounded"
        >
          <MenuIcon className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex flex-col items-center justify-center flex-grow px-6 py-10 text-center max-w-md mx-auto">
        {/* 얼굴 아이콘 영역 */}
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <div className="text-5xl text-gray-400">😊</div>
        </div>

        {/* 타이틀 및 설명 */}
        <h1 className="text-xl font-bold mb-1 text-gray-900">내 얼굴로 건강 상태를 스캔!</h1>
        <p className="text-gray-500 text-sm mb-8">
          AI가 30초 만에 당신의 건강을 분석해 드립니다.
        </p>

        {/* 에러 표시 */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded max-w-full">
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}

        {/* 버튼 그룹 */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleCameraUploadClick}
            disabled={isLoading}
            className={`flex items-center justify-center gap-3 w-full py-3 rounded-lg font-semibold transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            <CameraIcon className="w-5 h-5" />
            {isLoading ? '분석 중...' : (isMobile ? '사진 촬영하기' : '사진 업로드하기')}
            <UploadIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 의료 진단 목적 아님 안내 */}
        <p className="text-gray-400 text-xs mt-6 max-w-sm flex items-center justify-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          본 서비스는 의료 진단 목적으로 사용할 수 없으며, 건강 참고용입니다.
        </p>
      </main>

      
    </div>
  );
};

export default HomePage;

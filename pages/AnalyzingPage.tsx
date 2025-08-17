import React, { useState, useEffect } from 'react';

const AnalyzingPage: React.FC = () => {
  const messages = [
    "얼굴 특징을 분석 중입니다...",
    "피부 상태를 평가하고 있습니다...",
    "피로도를 측정합니다...",
    "AI가 건강 조언을 생성 중입니다..."
  ];

  const [message, setMessage] = useState(messages[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [messages]);

  // 진행률 애니메이션
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-noto-sans-kr">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-center px-4 py-3 border-b border-gray-200">
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
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex flex-col items-center justify-center flex-grow px-6 py-10 text-center max-w-md mx-auto">
        {/* 로딩 애니메이션 영역 */}
        <div className="relative mb-8">
          {/* 외부 원 */}
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
            {/* 스피너 */}
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          
          {/* 중앙 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl animate-bounce">🤖</div>
          </div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-xl font-bold mb-2 text-gray-900">
          AI가 분석 중입니다
        </h1>
        
        {/* 진행률 표시 */}
        <div className="w-full max-w-xs mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>분석 진행률</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 95)}%` }}
            ></div>
          </div>
        </div>

        {/* 분석 메시지 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 min-h-[60px] flex items-center justify-center">
          <p className="text-gray-600 text-sm text-center animate-pulse">
            {message}
          </p>
        </div>

        {/* 분석 단계 표시 */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg mb-1">✨</div>
            <div className="text-xs text-gray-600">피부 분석</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg mb-1">😴</div>
            <div className="text-xs text-gray-600">피로도 측정</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg mb-1">🌹</div>
            <div className="text-xs text-gray-600">혈색 확인</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg mb-1">💡</div>
            <div className="text-xs text-gray-600">조언 생성</div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <p className="text-gray-400 text-xs mt-6 max-w-sm">
          잠시만 기다려주세요. AI가 정확한 분석을 위해 최선을 다하고 있습니다.
        </p>
      </main>

      {/* 하단 여백 */}
      <div className="pb-4"></div>
    </div>
  );
};

export default AnalyzingPage;

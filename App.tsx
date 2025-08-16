import React, { useState, useCallback } from 'react';
import { Page, AnalysisResult } from './types';
import { analyzeFaceHealth } from './services/geminiService';

// 페이지 컴포넌트들 import
import HomePage from './pages/HomePage';
import AnalyzingPage from './pages/AnalyzingPage';
import ResultPage from './pages/ResultPage';
import SharingCenterPage from './pages/SharingCenterPage';
import SharingSettingsPage from './pages/SharingSettingsPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  // 얼굴 분석 처리 함수 - 파일을 필수 인자로 받도록 수정
  const handleStartAnalysis = useCallback(async (file: File) => {
    try {
      // 파일 검증
      if (!file) {
        console.error('❌ 파일이 없습니다.');
        alert('⚠️ 파일 오류\n\n분석할 이미지 파일이 없습니다.\n사진을 선택해주세요.');
        return;
      }

      console.log('📁 분석할 파일:', {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)}KB`,
        type: file.type
      });

      setIsLoading(true);
      setError(null);
      
      // 분석 중 페이지로 이동
      setCurrentPage(Page.Analyzing);
      
      // AI 분석 호출 - 파일을 명시적으로 전달
      const result = await analyzeFaceHealth(file);
      console.log('✅ 분석 완료:', result);
      
      setAnalysisResult(result);
      
      // 분석 완료 후 결과 페이지로 이동 (3초 후)
      setTimeout(() => {
        setCurrentPage(Page.Result);
        setIsLoading(false);
      }, 3000);
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      // 특정 오류들은 홈으로 바로 돌아가기
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage === 'NO_FACE_DETECTED' || 
            errorMessage === 'WRONG_IMAGE_TYPE' ||
            errorMessage === 'API_KEY_NOT_SET' ||
            errorMessage === 'INVALID_API_KEY_FORMAT') {
          setCurrentPage(Page.Home);
          setIsLoading(false);
          return;
        }
      }
      
      setError('건강 상태 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      setCurrentPage(Page.Home);
      setIsLoading(false);
    }
  }, []);

  // 에러 초기화
  const clearError = () => {
    setError(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return (
          <HomePage 
            onNavigate={navigateTo}
            onStartAnalysis={handleStartAnalysis}
            error={error}
            clearError={clearError}
            isLoading={isLoading}
          />
        );
      case Page.Analyzing:
        return <AnalyzingPage />;
      case Page.Result:
        return analysisResult ? (
          <ResultPage 
            result={analysisResult} 
            onNavigate={navigateTo}
          />
        ) : (
          <HomePage 
            onNavigate={navigateTo}
            onStartAnalysis={handleStartAnalysis}
            error="분석 결과를 불러올 수 없습니다. 다시 시도해주세요."
            clearError={clearError}
            isLoading={isLoading}
          />
        );
      case Page.SharingCenter:
        return <SharingCenterPage onNavigate={navigateTo} />;
      case Page.SharingSettings:
        return <SharingSettingsPage onNavigate={navigateTo} />;
      default:
        return (
          <HomePage 
            onNavigate={navigateTo}
            onStartAnalysis={handleStartAnalysis}
            error={error}
            clearError={clearError}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
};

export default App;

import React from 'react';
import { Page, AnalysisResult } from '../types';
import { ChevronLeftIcon, ShareIcon } from '../components/Icons';
import CircularProgress from '../components/CircularProgress';

interface ResultPageProps {
  result: AnalysisResult;
  onNavigate: (page: Page) => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ result, onNavigate }) => {
  // 결과가 없을 경우 기본값 설정 - 기존과 동일
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-noto-sans-kr">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button 
            onClick={() => onNavigate(Page.Home)}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="뒤로 가기"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">건강 분석 결과</h1>
          <div className="w-10" />
        </header>
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">분석 결과를 불러올 수 없습니다.</p>
            <button 
              onClick={() => onNavigate(Page.Home)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              홈으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 기존 함수들은 그대로 유지
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return '우수한 상태';
    if (score >= 60) return '주의 필요';
    return '관리 필요';
  };

  const getRecommendationIcon = (category: string) => {
    switch (category) {
      case '생활 습관':
        return '🌙';
      case '영양 관리':
        return '🥗';
      case '스킨케어':
        return '🧴';
      case '운동':
        return '💪';
      case '수분 섭취':
        return '💧';
      case '스트레스 관리':
        return '🧘‍♂️';
      case '휴식':
        return '😴';
      default:
        return '💡';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '피부 상태':
        return '✨';
      case '피로도':
        return '😴';
      case '혈색':
        return '🌹';
      case '부기':
        return '💧';
      case '눈가 주름':
        return '👁️';
      case '수분 상태':
        return '💦';
      case '스트레스 지표':
        return '😬';
      default:
        return '📊';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch(category) {
      case '피부 상태':
        return '피부 탄력, 주름, 모공, 전반적 피부 건강도';
      case '피로도':
        return '눈가 다크서클, 표정 피로감, 전반적 활력도';
      case '혈색':
        return '얼굴 혈색, 순환 상태, 자연스러운 안색';
      case '부기':
        return '얼굴 및 눈 주변 부종, 수분 정체 상태';
      case '눈가 주름':
        return '미세 주름, 표정 주름, 눈가 탄력도';
      case '수분 상태':
        return '피부 수분도, 건조함, 유분 밸런스';
      case '스트레스 지표':
        return '표정 긴장도, 이마 주름, 전반적 스트레스 징후';
      default:
        return '건강 상태 분석 항목';
    }
  };

  const getDetailedStatus = (score: number) => {
    if(score >= 90) return '매우 우수';
    if(score >= 80) return '우수';
    if(score >= 70) return '양호';
    if(score >= 60) return '보통';
    if(score >= 50) return '주의';
    if(score >= 40) return '관리 필요';
    return '즉시 관리 필요';
  };

  const getScoreProgress = (score: number) => {
    return Math.min(Math.max(score, 0), 100);
  };

  console.log('ResultPage - Analysis result:', result);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-noto-sans-kr">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button 
          onClick={() => onNavigate(Page.Home)}
          className="p-2 hover:bg-gray-100 rounded"
          aria-label="뒤로 가기"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">AI 건강 분석 결과</h1>
        <div className="w-10" />
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow px-4 py-6 space-y-6 max-w-md mx-auto w-full">
        {/* 전체 점수 섹션 - 가운데 정렬 강화 */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          {/* 중앙 정렬 컨테이너 */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* 원형 진행률 표시 */}
            <div className="mb-6">
              <CircularProgress score={result.overallScore || 0} />
            </div>
            
            {/* 제목 */}
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              종합 건강 점수
            </h2>
            
            {/* 상태 텍스트 */}
            <p className={`text-sm font-medium mb-4 ${getScoreColor(result.overallScore || 0)}`}>
              {result.summaryText || getStatusText(result.overallScore || 0)}
            </p>
            
            {/* AI 분석 안내 */}
            <div className="bg-white/70 rounded-lg px-4 py-2 text-xs text-gray-600 max-w-xs">
              🤖 AI가 얼굴 이미지를 분석한 종합 건강 상태입니다
            </div>
          </div>
        </section>

        {/* 상세 분석 섹션 - 기존과 동일 */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🔍 상세 분석 결과</h2>
          {result.details && result.details.length > 0 ? (
            <div className="space-y-4">
              {result.details.map((detail, index) => (
                <div key={index} className={`${getBgColor(detail.score || 0)} rounded-xl p-4 border-l-4 ${detail.score >= 80 ? 'border-green-500' : detail.score >= 60 ? 'border-orange-500' : 'border-red-500'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">
                          {getCategoryIcon(detail.category)}
                        </span>
                        <span className="text-gray-800 font-semibold text-sm">
                          {detail.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${detail.score >= 80 ? 'bg-green-200 text-green-800' : detail.score >= 60 ? 'bg-orange-200 text-orange-800' : 'bg-red-200 text-red-800'}`}>
                          {getDetailedStatus(detail.score || 0)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {getCategoryDescription(detail.category)}
                      </div>
                      {/* 점수 진행바 */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${detail.score >= 80 ? 'bg-green-500' : detail.score >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                            style={{ width: `${getScoreProgress(detail.score || 0)}%` }}
                          />
                        </div>
                        <span className={`font-bold ${getScoreColor(detail.score || 0)} text-sm min-w-[45px] text-right`}>
                          {detail.score || 0}점
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🤖</div>
              <p>상세 분석 결과를 불러올 수 없습니다.</p>
            </div>
          )}
        </section>

        {/* 맞춤 건강 조언 섹션 - 기존과 동일 */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">💡 AI 맞춤 건강 조언</h2>
          {result.recommendations && result.recommendations.length > 0 ? (
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 mt-1">
                      {getRecommendationIcon(rec.category)}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                        {rec.category}
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          맞춤 조언
                        </span>
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {rec.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💭</div>
              <p>맞춤 조언을 불러올 수 없습니다.</p>
            </div>
          )}
        </section>

        {/* 분석 정보 */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <div>
            <p className="text-xs text-blue-600 leading-relaxed text-center">
              ⚠️ 이 결과는 AI 기반 일반적인 건강 참고용이며 의료 진단이 아닙니다. 
              건강상 문제가 있을 경우 반드시 전문의와 상담하세요.
            </p>
          </div>
        </section>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          {/*
          <button 
            onClick={() => onNavigate(Page.SharingSettings)}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md"
          >
            <ShareIcon className="w-5 h-5" />
            분석 결과 공유하기
          </button>
          */}
          <button 
            onClick={() => onNavigate(Page.Home)}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            다시 분석하기
          </button>
        </div>
      </main>

      {/* 하단 여백 */}
      <div className="pb-4"></div>
    </div>
  );
};

export default ResultPage;

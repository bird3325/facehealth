import React, { useState, useEffect, useCallback } from 'react';
import { Page, AnalysisResult, HealthDetail } from './types';
import { analyzeFaceHealth } from './services/geminiService';
import CircularProgress from './components/CircularProgress';
import { CameraIcon, UploadIcon, GroupIcon, MenuIcon, FaceIcon, ChevronLeftIcon, ShareIcon, HeartIcon, CheckCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleStartAnalysis = useCallback(async () => {
    navigateTo(Page.Analyzing);
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeFaceHealth();
      setAnalysisResult(result);
      navigateTo(Page.Result);
    } catch (err) {
      setError('건강 상태 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      navigateTo(Page.Home);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage onStartAnalysis={handleStartAnalysis} onNavigate={navigateTo} />;
      case Page.Analyzing:
        return <AnalyzingPage />;
      case Page.Result:
        return analysisResult ? <ResultPage result={analysisResult} onNavigate={navigateTo} /> : <HomePage onStartAnalysis={handleStartAnalysis} onNavigate={navigateTo} />;
      case Page.SharingCenter:
        return <SharingCenterPage onNavigate={navigateTo} />;
      case Page.SharingSettings:
        return <SharingSettingsPage onNavigate={navigateTo} />;
      default:
        return <HomePage onStartAnalysis={handleStartAnalysis} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary">
      <div className="max-w-md mx-auto bg-brand-surface shadow-lg min-h-screen">
        {renderPage()}
      </div>
    </div>
  );
};

const Header: React.FC<{ title: string; onBack?: () => void }> = ({ title, onBack }) => (
    <header className="sticky top-0 bg-brand-surface/80 backdrop-blur-sm z-10 flex items-center justify-between p-4 border-b border-gray-200">
        {onBack ? (
            <button onClick={onBack} className="p-2 -ml-2 text-brand-text-secondary hover:text-brand-text-primary">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
        ) : <div className="w-10"></div>}
        <h1 className="text-lg font-bold text-brand-text-primary">{title}</h1>
        {onBack ? <div className="w-10"></div> : <button className="p-2 -mr-2 text-brand-text-secondary hover:text-brand-text-primary"><MenuIcon className="w-6 h-6" /></button>}
    </header>
);


const HomePage: React.FC<{ onStartAnalysis: () => void; onNavigate: (page: Page) => void; }> = ({ onStartAnalysis, onNavigate }) => (
    <div className="flex flex-col min-h-screen">
         <header className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-trust-blue"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/></svg>
                <h1 className="text-xl font-bold text-brand-text-primary">FaceHealth Scanner</h1>
            </div>
            <button className="p-2 -mr-2 text-brand-text-secondary hover:text-brand-text-primary"><MenuIcon className="w-6 h-6" /></button>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
            <FaceIcon className="w-24 h-24 text-trust-blue/20 mb-6" />
            <h2 className="text-2xl font-bold text-brand-text-primary mb-2">내 얼굴로 건강 상태를 스캔!</h2>
            <p className="text-brand-text-secondary mb-8">AI가 30초 만에 당신의 건강을 분석해 드립니다.</p>

            <div className="w-full space-y-4">
                <button onClick={onStartAnalysis} className="w-full bg-trust-blue text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors shadow-md">
                    <CameraIcon className="w-6 h-6" />
                    <span>사진 촬영하기</span>
                </button>
                <button onClick={onStartAnalysis} className="w-full bg-gray-100 text-brand-text-primary font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors">
                    <UploadIcon className="w-6 h-6" />
                    <span>사진 업로드하기</span>
                </button>
                 <button onClick={() => onNavigate(Page.SharingCenter)} className="w-full bg-share-purple text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-purple-700 transition-colors shadow-md">
                    <GroupIcon className="w-6 h-6" />
                    <span>공유된 건강 보기</span>
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-8">⚠️ 본 서비스는 의료 진단 목적으로 사용할 수 없으며, 건강 참고용입니다.</p>
        </main>
        <footer className="p-4 text-center">
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">광고 배너 영역</div>
        </footer>
    </div>
);

const AnalyzingPage: React.FC = () => {
    const messages = ["얼굴 특징을 분석 중입니다...", "피부 상태를 평가하고 있습니다...", "피로도를 측정합니다...", "AI가 건강 조언을 생성 중입니다..."];
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2000);
        return () => clearInterval(intervalId);
    }, [messages]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-trust-blue rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            </div>
            <h2 className="text-xl font-bold mt-8 mb-2 text-brand-text-primary">AI가 분석 중입니다...</h2>
            <p className="text-brand-text-secondary transition-opacity duration-500">{message}</p>
        </div>
    );
};

const ResultPage: React.FC<{ result: AnalysisResult; onNavigate: (page: Page) => void; }> = ({ result, onNavigate }) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-system-success';
        if (score >= 60) return 'text-system-warning';
        return 'text-system-error';
    };

    const getBgColor = (score: number) => {
        if (score >= 80) return 'bg-system-success/10';
        if (score >= 60) return 'bg-system-warning/10';
        return 'bg-system-error/10';
    };

    return (
        <div className="pb-24">
            <Header title="분석 결과" onBack={() => onNavigate(Page.Home)} />
            <main className="p-5">
                <section className="bg-brand-bg rounded-2xl p-6 flex flex-col items-center text-center mb-6">
                    <p className="text-brand-text-secondary mb-2">당신의 건강 점수</p>
                    <CircularProgress score={result.overallScore} />
                    <p className={`text-xl font-bold mt-4 ${getScoreColor(result.overallScore)}`}>"{result.summaryText}"</p>
                </section>

                <section className="mb-6">
                    <h3 className="text-lg font-bold mb-4">상세 분석 결과</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {result.details.map((detail: HealthDetail) => (
                            <div key={detail.category} className={`p-4 rounded-xl ${getBgColor(detail.score)}`}>
                                <p className="text-sm text-brand-text-secondary">{detail.category}</p>
                                <p className={`text-2xl font-bold ${getScoreColor(detail.score)}`}>{detail.score}점</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-6">
                    <h3 className="text-lg font-bold mb-4">맞춤형 건강 조언</h3>
                    <div className="space-y-3">
                        {result.recommendations.map((rec, index) => (
                            <div key={index} className="bg-brand-bg p-4 rounded-xl flex items-start gap-3">
                                <div className="bg-health-green/20 p-2 rounded-full mt-1">
                                    <CheckCircleIcon className="w-5 h-5 text-health-green" />
                                </div>
                                <div>
                                    <p className="font-bold text-brand-text-primary">{rec.category}</p>
                                    <p className="text-sm text-brand-text-secondary">{rec.tip}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                 <section>
                    <h3 className="text-lg font-bold mb-4">공유하기</h3>
                    <div className="grid grid-cols-2 gap-4">
                         <button onClick={() => onNavigate(Page.SharingSettings)} className="bg-share-purple text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow hover:bg-purple-700 transition">
                            <ShareIcon className="w-5 h-5"/>
                            <span>가족에게 공유</span>
                        </button>
                        <button className="bg-social-pink text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow hover:bg-pink-700 transition">
                             <HeartIcon className="w-5 h-5"/>
                             <span>격려 메시지 받기</span>
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

const SharingCenterPage: React.FC<{ onNavigate: (page: Page) => void; }> = ({ onNavigate }) => {
    const family = [
        { name: "엄마", score: 82, emoji: "😊" },
        { name: "아빠", score: 65, emoji: "😐" },
        { name: "동생", score: 88, emoji: "😄" },
        { name: "나", score: 78, emoji: "😊" },
    ];
    const friendsFeed = [
        { name: "김민수", action: "건강 점수 향상!", icon: <HeartIcon className="w-4 h-4 text-red-500" />, color: 'red' },
        { name: "이지영", action: "운동 목표 달성!", icon: <span className="text-lg">💪</span>, color: 'blue' },
        { name: "박철수", action: "금연 7일차!", icon: <span className="text-lg">🚭</span>, color: 'green' },
    ];
    
    return (
        <div>
            <Header title="건강 공유 센터" onBack={() => onNavigate(Page.Home)} />
            <main className="p-5 space-y-8">
                <section className="bg-brand-bg p-5 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 text-brand-text-primary">내 공유 현황</h3>
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-2xl font-bold text-share-purple">4<span className="text-sm font-medium">명</span></p>
                            <p className="text-xs text-brand-text-secondary">가족 그룹 연결</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-trust-blue">12<span className="text-sm font-medium">명</span></p>
                            <p className="text-xs text-brand-text-secondary">친구 팔로워</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-social-pink">8<span className="text-sm font-medium">개</span></p>
                            <p className="text-xs text-brand-text-secondary">이번 주 격려</p>
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="font-bold text-lg mb-4 text-brand-text-primary">가족 건강 상황</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {family.map(member => (
                            <div key={member.name} className="bg-brand-bg p-4 rounded-xl flex items-center justify-between">
                                <span className="font-semibold">{member.name}</span>
                                <span className="text-xl">{member.score} {member.emoji}</span>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h3 className="font-bold text-lg mb-4 text-brand-text-primary">친구들 건강 피드</h3>
                    <div className="space-y-3">
                        {friendsFeed.map((feed, i) => (
                             <div key={i} className="bg-brand-bg p-4 rounded-xl flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                   {feed.name[0]}
                               </div>
                               <div>
                                  <span className="font-semibold">{feed.name}</span>님이 {feed.action}
                               </div>
                               <div className="ml-auto">
                                   {feed.icon}
                               </div>
                           </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

const SharingSettingsPage: React.FC<{ onNavigate: (page: Page) => void; }> = ({ onNavigate }) => {
    return (
        <div>
            <Header title="공유 설정" onBack={() => onNavigate(Page.Result)} />
            <main className="p-5 space-y-8">
                <section>
                    <h3 className="font-bold text-lg mb-4 text-brand-text-primary">누구와 공유할까요?</h3>
                    <div className="space-y-4">
                        {['가족 그룹', '친한 친구들', '모든 팔로워', '소셜 미디어 (SNS)'].map((label, i) => (
                            <label key={label} className="flex items-center justify-between bg-brand-bg p-4 rounded-xl">
                                <span className="font-medium text-brand-text-primary">{label}</span>
                                <input type="checkbox" defaultChecked={i < 2} className="h-5 w-5 rounded text-trust-blue focus:ring-trust-blue" />
                            </label>
                        ))}
                    </div>
                </section>
                 <section>
                    <h3 className="font-bold text-lg mb-4 text-brand-text-primary">무엇을 공유할까요?</h3>
                    <div className="space-y-4">
                        {['전체 건강 점수', '개선된 항목', '상세 분석 결과', '건강 목표 달성'].map((label, i) => (
                            <label key={label} className="flex items-center justify-between bg-brand-bg p-4 rounded-xl">
                                <span className="font-medium text-brand-text-primary">{label}</span>
                                <input type="checkbox" defaultChecked={[0,1,3].includes(i)} className="h-5 w-5 rounded text-trust-blue focus:ring-trust-blue" />
                            </label>
                        ))}
                    </div>
                </section>
                <section>
                    <h3 className="font-bold text-lg mb-4 text-brand-text-primary">메시지 추가</h3>
                    <textarea 
                        className="w-full p-4 rounded-xl bg-brand-bg border border-gray-200 focus:ring-2 focus:ring-trust-blue focus:border-transparent"
                        rows={3}
                        placeholder='"오늘 건강 점수가 올랐어요! 💪"'
                    />
                </section>
                 <button onClick={() => alert('공유되었습니다!')} className="w-full bg-share-purple text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-colors shadow-md">
                    공유하기
                </button>
            </main>
        </div>
    );
};

export default App;

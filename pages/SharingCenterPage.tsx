import React from 'react';
import { Page } from '../types';
import { HeartIcon, CheckCircleIcon, ChevronLeftIcon } from '../components/Icons';

interface SharingCenterPageProps {
  onNavigate: (page: Page) => void;
}

const SharingCenterPage: React.FC<SharingCenterPageProps> = ({ onNavigate }) => {
  const family = [
    { name: "엄마", score: 82, emoji: "😊", status: "양호" },
    { name: "아빠", score: 65, emoji: "😐", status: "주의" },
    { name: "동생", score: 88, emoji: "😄", status: "우수" },
    { name: "나", score: 78, emoji: "😊", status: "양호" },
  ];

  const friendsFeed = [
    { name: "김민수", action: "건강 점수 향상!", icon: <HeartIcon className="w-5 h-5" />, color: 'text-red-500', time: "2시간 전" },
    { name: "이지영", action: "운동 목표 달성!", icon: "💪", color: 'text-blue-500', time: "5시간 전" },
    { name: "박철수", action: "금연 7일차!", icon: "🚭", color: 'text-green-500', time: "1일 전" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };

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
        <h1 className="text-xl font-semibold text-gray-900">건강 공유 센터</h1>
        <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow px-4 py-6 space-y-6 max-w-md mx-auto w-full">
        {/* 우리 가족 건강 */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">우리 가족 건강</h2>
          <div className="grid grid-cols-2 gap-3">
            {family.map((member, index) => (
              <div key={index} className={`${getScoreBgColor(member.score)} rounded-xl p-4 text-center`}>
                <div className="text-2xl mb-2">{member.emoji}</div>
                <div className="text-gray-800 font-medium text-sm">{member.name}</div>
                <div className={`${getScoreColor(member.score)} font-semibold text-sm`}>
                  {member.score}점
                </div>
                <div className="text-gray-600 text-xs mt-1">{member.status}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 친구들 활동 */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">친구들 활동</h2>
          <div className="space-y-3">
            {friendsFeed.map((friend, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex-shrink-0">
                  {typeof friend.icon === 'string' ? (
                    <span className="text-xl">{friend.icon}</span>
                  ) : (
                    <div className={friend.color}>{friend.icon}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-900 font-medium text-sm">{friend.name}</span>
                      <div className="text-gray-600 text-sm">{friend.action}</div>
                    </div>
                    <span className="text-gray-400 text-xs">{friend.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 공유 설정 관리 버튼 */}
        <button 
          onClick={() => onNavigate(Page.SharingSettings)}
          className="w-full bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors"
        >
          공유 설정 관리
        </button>
      </main>

      {/* 하단 여백 */}
      <div className="pb-4"></div>
    </div>
  );
};

export default SharingCenterPage;

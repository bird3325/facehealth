import React, { useState } from 'react';
import { Page } from '../types';
import { ChevronLeftIcon } from '../components/Icons';

interface SharingSettingsPageProps {
  onNavigate: (page: Page) => void;
}

const SharingSettingsPage: React.FC<SharingSettingsPageProps> = ({ onNavigate }) => {
  // 설정 상태 관리
  const [shareSettings, setShareSettings] = useState({
    family: true,
    friends: true,
    public: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    familyHealth: true,
    friendActivity: true,
  });

  const handleShareSettingChange = (key: keyof typeof shareSettings) => {
    setShareSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNotificationSettingChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    // 설정 저장 로직
    console.log('Settings saved:', { shareSettings, notificationSettings });
    // 저장 완료 후 이전 페이지로 돌아가기
    onNavigate(Page.SharingCenter);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-noto-sans-kr">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button 
          onClick={() => onNavigate(Page.SharingCenter)}
          className="p-2 hover:bg-gray-100 rounded"
          aria-label="뒤로 가기"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">공유 설정</h1>
        <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow px-4 py-6 space-y-6 max-w-md mx-auto w-full">
        {/* 공유 범위 섹션 */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">공유 범위</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
                <span className="text-gray-900 font-medium">가족과 공유</span>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
                checked={shareSettings.family}
                onChange={() => handleShareSettingChange('family')}
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <span className="text-gray-900 font-medium">친구와 공유</span>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
                checked={shareSettings.friends}
                onChange={() => handleShareSettingChange('friends')}
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <div className="text-gray-900 font-medium">공개 프로필</div>
                  <div className="text-gray-500 text-sm">모든 사용자가 볼 수 있습니다</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
                checked={shareSettings.public}
                onChange={() => handleShareSettingChange('public')}
              />
            </label>
          </div>
        </section>

        {/* 알림 설정 섹션 */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">알림 설정</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <div className="text-gray-900 font-medium">가족 건강 상태 알림</div>
                  <div className="text-gray-500 text-sm">가족의 건강 변화를 알려드립니다</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
                checked={notificationSettings.familyHealth}
                onChange={() => handleNotificationSettingChange('familyHealth')}
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <div className="text-gray-900 font-medium">친구 활동 알림</div>
                  <div className="text-gray-500 text-sm">친구들의 건강 활동을 알려드립니다</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" 
                checked={notificationSettings.friendActivity}
                onChange={() => handleNotificationSettingChange('friendActivity')}
              />
            </label>
          </div>
        </section>

        {/* 저장 버튼 */}
        <button 
          onClick={handleSaveSettings}
          className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-400 transition-colors"
        >
          설정 저장
        </button>
      </main>

      {/* 하단 여백 */}
      <div className="pb-4"></div>
    </div>
  );
};

export default SharingSettingsPage;

import React from 'react';
import { ChevronLeftIcon } from './Icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => (
  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md">
    {onBack && (
      <button onClick={onBack} className="p-2">
        <ChevronLeftIcon className="w-6 h-6 text-white" />
      </button>
    )}
    <h1 className="text-xl font-bold text-white flex-1 text-center">
      {title}
    </h1>
    {onBack && <div className="w-10" />}
  </div>
);

export default Header;

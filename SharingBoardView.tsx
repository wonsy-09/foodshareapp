import React from 'react';
import { Refrigerator, HeartHandshake, Award, MapPin, Sparkles, PieChart, Leaf } from 'lucide-react';
import { UserProfile } from '../types';
import { KOREA_NEIGHBORHOODS } from '../data/mockData';

interface HeaderProps {
  activeTab: 'fridge' | 'sharing' | 'report';
  setActiveTab: (tab: 'fridge' | 'sharing' | 'report') => void;
  user: UserProfile;
  setUserLocation: (loc: string) => void;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  setUserLocation,
  urgentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F5F5F0]/95 backdrop-blur-md border-b border-[rgba(90,90,64,0.12)] shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between py-2.5 border-b border-[rgba(90,90,64,0.08)] text-xs sm:text-sm text-[#8D917A] gap-2">
          {/* Location Selector */}
          <div className="flex items-center gap-1.5 bg-[#E9EED9] px-3.5 py-1.5 rounded-full border border-[rgba(90,90,64,0.15)] text-[#5A5A40] font-medium shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#5A5A40] animate-pulse" />
            <span className="text-xs">📍 내 동네:</span>
            <select
              value={user.location}
              onChange={(e) => setUserLocation(e.target.value)}
              className="bg-transparent font-bold text-[#5A5A40] focus:outline-none cursor-pointer text-xs"
            >
              {KOREA_NEIGHBORHOODS.map((loc) => (
                <option key={loc} value={loc} className="bg-[#FAF9F6] text-[#3A3A2E]">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* User Badge & Impact Quick Stats */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-[#D4A373]/20 text-[#8C572B] px-3 py-1 rounded-full border border-[#D4A373]/30 font-semibold text-xs">
              <Award className="w-3.5 h-3.5 text-[#D4A373]" />
              {user.badgeLevel}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#8D917A] text-xs">
              <Leaf className="w-3.5 h-3.5 text-[#5A5A40]" />
              누적 절약 <strong className="text-[#5A5A40] font-bold">{user.totalSavedMoney.toLocaleString()}원</strong>
            </span>
          </div>
        </div>

        {/* Main Nav Header */}
        <div className="flex items-center justify-between py-3.5">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('fridge')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] text-[#F5F5F0] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Refrigerator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-[#3A3A2E] font-serif-natural">소소식탁</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E9EED9] text-[#5A5A40] px-2 py-0.5 rounded-full border border-[rgba(90,90,64,0.1)]">
                  1인 가구 AI
                </span>
              </div>
              <p className="text-xs text-[#8D917A] hidden sm:block">식재료 나눔 · 소비기한 관리 · 식비 절약</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <nav className="flex items-center bg-[#E9EED9]/60 p-1 rounded-2xl border border-[rgba(90,90,64,0.12)] text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('fridge')}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition-all ${
                activeTab === 'fridge'
                  ? 'bg-[#5A5A40] text-[#F5F5F0] shadow-xs font-semibold'
                  : 'text-[#5A5A40] hover:bg-[#E9EED9]'
              }`}
            >
              <Refrigerator className="w-4 h-4" />
              <span>내 냉장고</span>
              {urgentCount > 0 && (
                <span className="ml-1 bg-[#D4A373] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce shadow-2xs">
                  {urgentCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sharing')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition-all ${
                activeTab === 'sharing'
                  ? 'bg-[#5A5A40] text-[#F5F5F0] shadow-xs font-semibold'
                  : 'text-[#5A5A40] hover:bg-[#E9EED9]'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>이웃 나눔터</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-[#5A5A40] text-[#F5F5F0] shadow-xs font-semibold'
                  : 'text-[#5A5A40] hover:bg-[#E9EED9]'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>나눔 리포트</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

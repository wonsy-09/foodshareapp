import React, { useState } from 'react';
import { Camera, Plus, Search, Filter, AlertTriangle, Clock, Sparkles, HeartHandshake, Trash2, ShieldAlert, CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { CategoryType, ExpiryStatus, Ingredient, SharingPost, StorageType } from '../types';
import { AiMatchingWidget } from './AiMatchingWidget';

interface FridgeViewProps {
  ingredients: Ingredient[];
  posts: SharingPost[];
  onOpenAiScanner: () => void;
  onOpenManualForm: () => void;
  onDeleteIngredient: (id: string) => void;
  onOpenCreatePostWithItem: (item: Ingredient) => void;
  onSelectPost: (post: SharingPost) => void;
}

export const FridgeView: React.FC<FridgeViewProps> = ({
  ingredients,
  posts,
  onOpenAiScanner,
  onOpenManualForm,
  onDeleteIngredient,
  onOpenCreatePostWithItem,
  onSelectPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStorage, setSelectedStorage] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);

  // Helper to calculate D-day and Status
  const getExpiryDetails = (expiryDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiryDateStr);
    expDate.setHours(0, 0, 0, 0);

    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: ExpiryStatus = 'fresh';
    let label = `D-${diffDays}`;
    let badgeBg = 'bg-[#E9EED9] text-[#5A5A40] border-[rgba(90,90,64,0.2)]';

    if (diffDays <= 0) {
      status = 'expired';
      label = diffDays === 0 ? 'D-DAY 오늘만료' : `${Math.abs(diffDays)}일 지나침`;
      badgeBg = 'bg-[#D4A373] text-white border-[#D4A373] font-bold animate-pulse';
    } else if (diffDays <= 1) {
      status = 'urgent';
      label = `D-1 긴급소비`;
      badgeBg = 'bg-[#D4A373]/20 text-[#8C572B] border-[#D4A373]/50 font-bold animate-pulse';
    } else if (diffDays <= 3) {
      status = 'warning';
      label = `D-${diffDays} 소비임박`;
      badgeBg = 'bg-[#D4A373]/15 text-[#8C572B] border-[#D4A373]/40 font-bold';
    } else {
      label = `D-${diffDays}`;
      badgeBg = 'bg-[#E9EED9] text-[#5A5A40] border-[rgba(90,90,64,0.2)]';
    }

    return { diffDays, status, label, badgeBg };
  };

  // Filter logic
  const filteredIngredients = ingredients.filter((item) => {
    const { status, diffDays } = getExpiryDetails(item.expiryDate);

    // Search query
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.includes(searchQuery);

    // Storage filter
    const matchesStorage =
      selectedStorage === 'ALL' || item.storage === selectedStorage;

    // Category filter
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;

    // Status filter
    let matchesStatus = true;
    if (selectedStatus === 'URGENT') {
      matchesStatus = diffDays <= 2;
    } else if (selectedStatus === 'WARNING') {
      matchesStatus = diffDays > 2 && diffDays <= 4;
    } else if (selectedStatus === 'FRESH') {
      matchesStatus = diffDays > 4;
    }

    return matchesSearch && matchesStorage && matchesCategory && matchesStatus;
  });

  // Calculate quick status counts
  const urgentCount = ingredients.filter(
    (i) => getExpiryDetails(i.expiryDate).diffDays <= 2
  ).length;

  const warningCount = ingredients.filter((i) => {
    const d = getExpiryDetails(i.expiryDate).diffDays;
    return d > 2 && d <= 4;
  }).length;

  return (
    <div className="space-y-6">
      {/* AI Smart Matching Banner */}
      <AiMatchingWidget
        ingredients={ingredients}
        posts={posts}
        onOpenCreatePostWithItem={onOpenCreatePostWithItem}
        onSelectPost={onSelectPost}
      />

      {/* Immediate Core: Ingredient Registration Control Bar */}
      <div className="bg-[#FAF9F6] rounded-3xl p-6 shadow-2xs border border-[rgba(90,90,64,0.12)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#3A3A2E] font-serif-natural flex items-center gap-2">
              <span>내 냉장고 & 스마트 소비기한</span>
              <span className="text-xs bg-[#E9EED9] text-[#5A5A40] px-2.5 py-0.5 rounded-full font-semibold border border-[rgba(90,90,64,0.1)]">
                총 {ingredients.length}개 식재료
              </span>
            </h2>
            <p className="text-xs text-[#8D917A] mt-0.5">
              사진 촬영 한 번으로 자동 등록하고, 소비기한 임박 전 이웃과 나눔하세요.
            </p>
          </div>

          {/* Core Action Buttons: AI Scan & Manual Add */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenAiScanner}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#5A5A40] hover:bg-[#484833] text-[#F5F5F0] text-xs sm:text-sm font-semibold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#E9EED9]" />
              <span>📷 AI 영수증/사진 자동등록</span>
            </button>

            <button
              onClick={onOpenManualForm}
              className="px-3.5 py-2.5 bg-[#E9EED9] hover:bg-[#dce3ca] text-[#5A5A40] text-xs sm:text-sm font-semibold rounded-2xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>수동 등록</span>
            </button>
          </div>
        </div>

        {/* Urgent Notification Banner if items near expiration */}
        {urgentCount > 0 && (
          <div className="bg-[#D4A373]/15 border border-[#D4A373]/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-[#8C572B]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D4A373] shrink-0" />
              <span>
                소비기한이 <strong>2일 이내</strong>인 식재료가{' '}
                <strong className="text-[#8C572B]">{urgentCount}개</strong> 있습니다!
                이웃에게 나눔하고 식비를 절약해보세요.
              </span>
            </div>
            <button
              onClick={() => setSelectedStatus('URGENT')}
              className="shrink-0 font-bold underline hover:text-[#5A3B1C]"
            >
              임박 재료만 보기
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-3 border-t border-[rgba(90,90,64,0.1)]">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-[#8D917A] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="식재료 검색..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[rgba(90,90,64,0.15)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#3A3A2E]"
            />
          </div>

          {/* Storage Filter */}
          <select
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[rgba(90,90,64,0.15)] rounded-xl bg-white focus:outline-none text-[#3A3A2E]"
          >
            <option value="ALL">전체 보관방식</option>
            <option value="냉장">냉장 🧊</option>
            <option value="냉동">냉동 ❄️</option>
            <option value="상온">상온 🧺</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[rgba(90,90,64,0.15)] rounded-xl bg-white focus:outline-none text-[#3A3A2E] font-medium"
          >
            <option value="ALL">전체 상태</option>
            <option value="URGENT">🔴 소비 긴급/임박 ({urgentCount})</option>
            <option value="WARNING">🟡 경고 ({warningCount})</option>
            <option value="FRESH">🟢 신선함</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[rgba(90,90,64,0.15)] rounded-xl bg-white focus:outline-none text-[#3A3A2E]"
          >
            <option value="ALL">전체 카테고리</option>
            <option value="채소/과일">채소/과일 🍎</option>
            <option value="정육/계란">정육/계란 🥩</option>
            <option value="가공식품/양념">가공식품/양념 🥫</option>
            <option value="베이커리/간식">베이커리/간식 🍞</option>
            <option value="음료/유제품">음료/유제품 🥛</option>
          </select>
        </div>
      </div>

      {/* Ingredient Grid List */}
      {filteredIngredients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Info className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-600 font-medium">조건에 맞는 식재료가 없습니다.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStorage('ALL');
              setSelectedStatus('ALL');
              setSelectedCategory('ALL');
            }}
            className="text-xs text-emerald-700 font-semibold underline"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.map((item) => {
            const { diffDays, status, label, badgeBg } = getExpiryDetails(item.expiryDate);
            const isTipExpanded = expandedTipId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 border transition-all hover:shadow-md relative flex flex-col justify-between ${
                  status === 'urgent' || status === 'expired'
                    ? 'border-red-200 bg-red-50/20'
                    : status === 'warning'
                    ? 'border-amber-200 bg-amber-50/10'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Card Top: Storage icon & Expiry Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {item.storage === '냉장' ? '🧊 냉장' : item.storage === '냉동' ? '❄️ 냉동' : '🧺 상온'} · {item.category}
                    </span>

                    {/* Expiry D-Day Badge */}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${badgeBg}`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Title & Quantity */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug tracking-tight mb-1">
                    {item.name}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    <span>수량: <strong>{item.quantity}</strong></span>
                    <span>구매일: {item.purchaseDate}</span>
                  </div>

                  {/* AI Storage Tip section */}
                  {item.storageTip && (
                    <div className="mt-3">
                      <button
                        onClick={() =>
                          setExpandedTipId(isTipExpanded ? null : item.id)
                        }
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 focus:outline-none"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>AI 보관 꿀팁</span>
                        {isTipExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {isTipExpanded && (
                        <p className="mt-1.5 p-2 bg-emerald-50/80 rounded-lg text-xs text-emerald-950 border border-emerald-100 leading-relaxed">
                          {item.storageTip}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom: Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onDeleteIngredient(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="식재료 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* 1-Click Share Button */}
                  <button
                    onClick={() => onOpenCreatePostWithItem(item)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      status === 'urgent' || status === 'expired'
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>
                      {status === 'urgent' ? '이웃에 긴급 나눔' : '이웃에 나눔글 올리기'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

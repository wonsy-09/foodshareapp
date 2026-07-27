import React, { useState } from 'react';
import { X, Sparkles, Loader2, Plus, Calendar, Package } from 'lucide-react';
import { CategoryType, Ingredient, StorageType } from '../types';

interface IngredientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIngredient: (item: Omit<Ingredient, 'id'>) => void;
}

export const IngredientFormModal: React.FC<IngredientFormModalProps> = ({
  isOpen,
  onClose,
  onAddIngredient,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('채소/과일');
  const [quantity, setQuantity] = useState('');
  const [storage, setStorage] = useState<StorageType>('냉장');
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [expiryDays, setExpiryDays] = useState(7);
  const [storageTip, setStorageTip] = useState('');
  const [priceEstimate, setPriceEstimate] = useState(3000);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!isOpen) return null;

  // Calculate Expiry Date string from purchaseDate + expiryDays
  const getCalculatedExpiryDate = () => {
    const pDate = new Date(purchaseDate || new Date());
    pDate.setDate(pDate.getDate() + Number(expiryDays));
    return pDate.toISOString().split('T')[0];
  };

  const handleAiAutoFill = async () => {
    if (!name.trim()) {
      alert('품목명을 입력하신 후 AI 소비기한 자동계산을 눌러주세요.');
      return;
    }

    setLoadingAi(true);
    try {
      const response = await fetch('/api/calculate-expiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, storage, category }),
      });
      const data = await response.json();

      if (data.expiryDays) setExpiryDays(data.expiryDays);
      if (data.storageTip) setStorageTip(data.storageTip);
      if (data.recommendedStorage) setStorage(data.recommendedStorage as StorageType);
    } catch (err) {
      console.error(err);
      // Smart offline default
      setExpiryDays(category === '채소/과일' ? 7 : category === '정육/계란' ? 14 : 10);
      setStorageTip('밀폐 용기에 담아 서늘한 환경에서 보관하세요.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddIngredient({
      name: name.trim(),
      category,
      quantity: quantity.trim() || '1개',
      purchaseDate,
      expiryDate: getCalculatedExpiryDate(),
      storage,
      storageTip: storageTip.trim() || '밀폐 용기 보관을 권장합니다.',
      priceEstimate: Number(priceEstimate) || 3000,
      weightEstimateKg: 0.3,
      isShared: false,
      addedMethod: 'manual',
    });

    onClose();
    // Reset
    setName('');
    setQuantity('');
    setStorageTip('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3A3A2E]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-3xl max-w-lg w-full p-6 shadow-2xl my-8 border border-[rgba(90,90,64,0.15)]">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(90,90,64,0.1)]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#E9EED9] text-[#5A5A40] rounded-2xl">
              <Package className="w-5 h-5 text-[#5A5A40]" />
            </div>
            <h3 className="text-lg font-bold text-[#3A3A2E] font-serif-natural">식재료 수동 등록</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8D917A] hover:text-[#3A3A2E] hover:bg-[#E9EED9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Item Name + AI Auto-Fill button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#3A3A2E]">
                품목명 <span className="text-[#D4A373]">*</span>
              </label>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={loadingAi || !name.trim()}
                className="text-xs text-[#5A5A40] hover:text-[#3A3A2E] bg-[#E9EED9] hover:bg-[#dce3ca] px-3 py-1 rounded-xl border border-[rgba(90,90,64,0.15)] font-semibold flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loadingAi ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                )}
                <span>AI 소비기한 자동계산</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 대파, 찌개용 두부, 계란 10구"
              className="w-full px-3.5 py-2.5 text-sm border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 font-medium text-[#3A3A2E]"
            />
          </div>

          {/* Category & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A2E] mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3.5 py-2.5 text-sm border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#3A3A2E]"
              >
                <option value="채소/과일">채소/과일 🍎</option>
                <option value="정육/계란">정육/계란 🥩</option>
                <option value="수산물">수산물 🐟</option>
                <option value="가공식품/양념">가공식품/양념 🥫</option>
                <option value="베이커리/간식">베이커리/간식 🍞</option>
                <option value="음료/유제품">음료/유제품 🥛</option>
                <option value="기타">기타 📦</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A3A2E] mb-1">수량/용량</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="예: 1단, 300g, 1팩"
                className="w-full px-3.5 py-2.5 text-sm border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#3A3A2E]"
              />
            </div>
          </div>

          {/* Storage & Expiry Days */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A2E] mb-1">보관 방식</label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value as StorageType)}
                className="w-full px-3.5 py-2.5 text-sm border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#3A3A2E]"
              >
                <option value="냉장">냉장 🧊</option>
                <option value="냉동">냉동 ❄️</option>
                <option value="상온">상온 🧺</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A3A2E] mb-1">
                소비기한 (일수)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 font-bold text-[#5A5A40]"
                />
                <span className="text-xs text-[#8D917A] shrink-0">일 후 만료</span>
              </div>
            </div>
          </div>

          {/* Dates & Price Estimate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A3A2E] mb-1">구매일</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#3A3A2E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A3A2E] mb-1">
                예상 가격 (원)
              </label>
              <input
                type="number"
                step={500}
                value={priceEstimate}
                onChange={(e) => setPriceEstimate(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#3A3A2E]"
              />
            </div>
          </div>

          {/* Calculated Date Preview */}
          <div className="p-3.5 bg-[#E9EED9]/60 rounded-2xl text-xs text-[#5A5A40] flex items-center justify-between border border-[rgba(90,90,64,0.12)]">
            <span className="font-semibold text-[#5A5A40] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
              예상 소비기한 날짜:
            </span>
            <strong className="font-bold text-sm text-[#3A3A2E]">{getCalculatedExpiryDate()}</strong>
          </div>

          {/* Storage Tip */}
          <div>
            <label className="block text-xs font-semibold text-[#3A3A2E] mb-1">
              보관 꿀팁 (선택)
            </label>
            <input
              type="text"
              value={storageTip}
              onChange={(e) => setStorageTip(e.target.value)}
              placeholder="예: 키친타올을 깔고 냉장 보관하면 3일 더 유지돼요."
              className="w-full px-3.5 py-2 text-sm border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#3A3A2E]"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#5A5A40] hover:bg-[#484833] text-[#FAF9F6] font-bold text-sm rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>내 냉장고에 추가하기</span>
          </button>
        </form>
      </div>
    </div>
  );
};

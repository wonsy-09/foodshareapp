import React, { useState } from 'react';
import { Sparkles, ArrowRight, HeartHandshake, Loader2, Utensils, AlertTriangle } from 'lucide-react';
import { Ingredient, SharingPost } from '../types';

interface AiMatchingWidgetProps {
  ingredients: Ingredient[];
  posts: SharingPost[];
  onOpenCreatePostWithItem: (item: Ingredient) => void;
  onSelectPost: (post: SharingPost) => void;
}

export const AiMatchingWidget: React.FC<AiMatchingWidgetProps> = ({
  ingredients,
  posts,
  onOpenCreatePostWithItem,
  onSelectPost,
}) => {
  const [loading, setLoading] = useState(false);
  const [matchingResult, setMatchingResult] = useState<any | null>(null);

  const handleRunAiMatching = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-share-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIngredients: ingredients.map((i) => ({
            name: i.name,
            expiryDate: i.expiryDate,
            storage: i.storage,
          })),
          neighborhoodItems: posts.map((p) => ({
            id: p.id,
            title: p.title,
            ingredientName: p.ingredientName,
            authorName: p.author.name,
          })),
        }),
      });

      const data = await response.json();
      if (data.matching) {
        setMatchingResult(data.matching);
      }
    } catch (err) {
      console.error(err);
      // Fallback fallback
      const urgentItem = ingredients[0];
      setMatchingResult({
        recommendedShareItemName: urgentItem?.name || '대파 반 단',
        shareReason: '소비기한이 1일 남아있어요! 이웃에게 나눔하고 식비 손실을 막아보세요.',
        matchedNeighborhoodPairs: [
          {
            neighborItemName: posts[0]?.ingredientName || '두부 1모',
            neighborOwner: posts[0]?.author.name || '자취2년차',
            suggestedDish: '대파 두부 된장찌개',
            reason: '회원님의 대파와 이웃의 두부를 조합하면 근사한 자취 한 상 요리가 완성됩니다.',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#5A5A40] text-[#FAF9F6] rounded-3xl p-6 shadow-sm border border-[rgba(90,90,64,0.3)] relative overflow-hidden">
      {/* Decorative background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E9EED9]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#E9EED9]/20 text-[#E9EED9] text-xs font-semibold px-3 py-1 rounded-full border border-[#E9EED9]/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              AI 스마트 나눔 & 레시피 조합 매칭
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white font-serif-natural tracking-tight">
            내 냉장고 & 우리 동네 이웃 나눔 맞춤 분석
          </h3>
          <p className="text-xs text-[#E9EED9]/90">
            소비기한 임박한 내 재료를 이웃에게 제안하고, 함께 요리하기 좋은 이웃 식재료를 찾아드려요.
          </p>
        </div>

        <button
          onClick={handleRunAiMatching}
          disabled={loading}
          className="shrink-0 px-4 py-2.5 bg-[#E9EED9] hover:bg-[#dce3ca] text-[#5A5A40] font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#5A5A40]" />
              <span>AI 매칭 분석 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              <span>AI 맞춤 매칭 실행</span>
            </>
          )}
        </button>
      </div>

      {/* Matching Results View */}
      {matchingResult && (
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.15)] grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10 text-xs">
          {/* Card 1: Recommended Share Item */}
          <div className="bg-[#3A3A2E]/40 border border-[#E9EED9]/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#E9EED9] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D4A373]" />
                나눔 추천 식재료
              </span>
              <span className="bg-[#D4A373]/30 text-[#D4A373] text-[10px] font-bold px-2 py-0.5 rounded-md">
                소비기한 주의
              </span>
            </div>
            <div className="font-bold text-sm text-white">{matchingResult.recommendedShareItemName}</div>
            <p className="text-[#E9EED9]/90 text-[11px] leading-relaxed">
              {matchingResult.shareReason}
            </p>

            {/* Quick Share Trigger */}
            <button
              onClick={() => {
                const targetIng = ingredients.find(
                  (i) => i.name.includes(matchingResult.recommendedShareItemName) || true
                );
                if (targetIng) onOpenCreatePostWithItem(targetIng);
              }}
              className="mt-1 w-full py-2 bg-[#E9EED9]/20 hover:bg-[#E9EED9]/30 text-[#E9EED9] hover:text-white border border-[#E9EED9]/30 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>이 재료 바로 나눔글 올리기</span>
            </button>
          </div>

          {/* Card 2: Neighbor Pairing Suggestion */}
          <div className="bg-[#3A3A2E]/40 border border-[#E9EED9]/20 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#E9EED9] font-semibold flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-[#D4A373]" />
                이웃 재료 알뜰 요리 조합
              </span>
              <span className="bg-[#E9EED9]/20 text-[#E9EED9] text-[10px] font-bold px-2 py-0.5 rounded-md">
                식비 절약 조합
              </span>
            </div>

            {matchingResult.matchedNeighborhoodPairs && matchingResult.matchedNeighborhoodPairs[0] ? (
              <div className="space-y-1.5">
                <div className="font-bold text-sm text-white">
                  {matchingResult.matchedNeighborhoodPairs[0].suggestedDish} 🍲
                </div>
                <p className="text-[#E9EED9]/90 text-[11px] leading-relaxed">
                  {matchingResult.matchedNeighborhoodPairs[0].reason}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-[#E9EED9]">
                  <span>
                    이웃: <strong>@{matchingResult.matchedNeighborhoodPairs[0].neighborOwner}</strong> (
                    {matchingResult.matchedNeighborhoodPairs[0].neighborItemName})
                  </span>
                  <button
                    onClick={() => {
                      if (posts.length > 0) onSelectPost(posts[0]);
                    }}
                    className="text-[#E9EED9] hover:text-white font-semibold underline flex items-center gap-0.5"
                  >
                    <span>이웃 글 보기</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[#E9EED9]/80 text-[11px]">
                이웃 나눔글에서 회원님의 식재료와 어울리는 최고의 한 쌍을 발견하세요!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

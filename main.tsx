import React, { useState } from 'react';
import { X, MapPin, Calendar, Heart, Send, CheckCircle, ArrowRightLeft, Gift, User, ShieldCheck, Sparkles } from 'lucide-react';
import { SharingPost, SharingRecord } from '../types';

interface PostDetailModalProps {
  post: SharingPost | null;
  onClose: () => void;
  onCompleteShare: (record: SharingRecord) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onCompleteShare,
}) => {
  const [chatMessages, setChatMessages] = useState<
    { sender: 'me' | 'partner'; text: string; time: string }[]
  >([
    {
      sender: 'partner',
      text: '안녕하세요! 올려주신 식재료 나눔 글 보고 연락드립니다 😊',
      time: '방금 전',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isReserved, setIsReserved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!post) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: 'me' as const,
      text: inputText.trim(),
      time: '방금 전',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Auto partner response simulation
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'partner',
          text: '감사합니다! 지정해주신 역 앞 신선 거래함에서 뵙거나 문고리 거래로 전달받겠습니다!',
          time: '방금 전',
        },
      ]);
      setIsReserved(true);
    }, 1000);
  };

  const handleFinishTransaction = () => {
    setIsCompleted(true);

    const savedVal = post.type === 'free' ? 4500 : 3500;

    const newRecord: SharingRecord = {
      id: `rec_${Date.now()}`,
      postTitle: post.title,
      ingredientName: post.ingredientName,
      quantity: post.quantity,
      partnerName: post.author.name,
      type: 'received',
      date: new Date().toISOString().split('T')[0],
      savedMoney: savedVal,
      wastePreventedKg: 0.35,
      co2PreventedKg: 0.8,
    };

    onCompleteShare(newRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3A3A2E]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] rounded-3xl max-w-xl w-full p-6 shadow-2xl my-8 border border-[rgba(90,90,64,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(90,90,64,0.1)]">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                post.type === 'free'
                  ? 'bg-[#E9EED9] text-[#5A5A40]'
                  : 'bg-[#D4A373]/20 text-[#8C572B]'
              }`}
            >
              {post.type === 'free' ? '무료 나눔 🎁' : '물꼬 교환 🔄'}
            </span>
            <span className="text-xs text-[#8D917A]">{post.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8D917A] hover:text-[#3A3A2E] hover:bg-[#E9EED9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Post Image & Author info */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[rgba(90,90,64,0.1)]">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-[rgba(90,90,64,0.2)]"
              />
              <div>
                <div className="font-bold text-sm text-[#3A3A2E]">{post.author.name}</div>
                <div className="text-xs text-[#8D917A] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#D4A373]" />
                  {post.location} ({post.distanceKm}km)
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#8D917A] block">{post.createdAt}</span>
              <span className="text-xs font-semibold text-[#5A5A40] bg-[#E9EED9] px-2.5 py-0.5 rounded-full inline-block mt-1">
                인증된 이웃 🌿
              </span>
            </div>
          </div>

          {/* Image preview */}
          {post.imageUrl && (
            <div className="rounded-2xl overflow-hidden max-h-56 bg-[#E9EED9] border border-[rgba(90,90,64,0.1)]">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Post Title & Description */}
          <div>
            <h2 className="text-lg font-bold text-[#3A3A2E] font-serif-natural tracking-tight">{post.title}</h2>
            <div className="flex items-center gap-4 text-xs text-[#8D917A] mt-1 mb-2">
              <span>식재료: <strong className="text-[#3A3A2E]">{post.ingredientName}</strong></span>
              <span>수량: <strong className="text-[#3A3A2E]">{post.quantity}</strong></span>
              <span>보관: <strong className="text-[#3A3A2E]">{post.storage}</strong></span>
            </div>
            <p className="text-xs sm:text-sm text-[#3A3A2E] leading-relaxed bg-white p-4 rounded-2xl border border-[rgba(90,90,64,0.1)] whitespace-pre-line">
              {post.description}
            </p>
          </div>

          {/* Exchange Need if any */}
          {post.type === 'exchange' && post.exchangeWant && (
            <div className="p-3 bg-[#E9EED9]/60 border border-[rgba(90,90,64,0.12)] rounded-2xl text-xs text-[#5A5A40]">
              <span className="font-bold block mb-0.5">희망 교환품:</span>
              <span>{post.exchangeWant}</span>
            </div>
          )}

          {/* Neighborhood Chat Simulation Area */}
          <div className="pt-3 border-t border-[rgba(90,90,64,0.1)]">
            <h4 className="text-xs font-bold text-[#3A3A2E] mb-2 flex items-center gap-1.5 font-serif-natural">
              <span>이웃 메시지 & 나눔 예약</span>
              <span className="text-[10px] bg-[#E9EED9] text-[#5A5A40] px-2 py-0.5 rounded-full font-sans font-semibold">
                안심 이웃 소통
              </span>
            </h4>

            <div className="bg-white rounded-2xl p-3.5 border border-[rgba(90,90,64,0.1)] space-y-2.5 max-h-48 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'me' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs ${
                      msg.sender === 'me'
                        ? 'bg-[#5A5A40] text-[#FAF9F6] rounded-br-none'
                        : 'bg-[#FAF9F6] text-[#3A3A2E] border border-[rgba(90,90,64,0.1)] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#8D917A] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Message Form */}
            {!isCompleted ? (
              <form onSubmit={handleSendMessage} className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="이웃에게 메시지를 남겨보세요..."
                  className="flex-1 px-3.5 py-2 text-xs border border-[rgba(90,90,64,0.15)] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#3A3A2E]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FAF9F6] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>전송</span>
                </button>
              </form>
            ) : (
              <div className="mt-3 p-3 bg-[#E9EED9] text-[#5A5A40] rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 border border-[rgba(90,90,64,0.15)]">
                <CheckCircle className="w-4 h-4 text-[#5A5A40]" />
                <span>나눔 거래 완료! 나의 나눔 리포트에 자동 기록되었습니다. 🎉</span>
              </div>
            )}

            {/* Confirm Transaction Button */}
            {isReserved && !isCompleted && (
              <div className="mt-3">
                <button
                  onClick={handleFinishTransaction}
                  className="w-full py-3 bg-[#5A5A40] hover:bg-[#484833] text-[#FAF9F6] text-xs font-bold rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>나눔 거래 완료하기 & 환경/식비 절약 리포트 기록</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

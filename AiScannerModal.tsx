export type StorageType = '냉장' | '냉동' | '상온';

export type CategoryType = 
  | '채소/과일' 
  | '정육/계란' 
  | '수산물' 
  | '가공식품/양념' 
  | '베이커리/간식' 
  | '음료/유제품' 
  | '기타';

export type ExpiryStatus = 'fresh' | 'warning' | 'urgent' | 'expired';

export interface Ingredient {
  id: string;
  name: string;
  category: CategoryType;
  quantity: string;
  purchaseDate: string; // YYYY-MM-DD
  expiryDate: string;   // YYYY-MM-DD
  storage: StorageType;
  storageTip?: string;
  priceEstimate: number; // KRW
  weightEstimateKg: number; // kg
  isShared?: boolean;
  notes?: string;
  addedMethod?: 'ai_scan' | 'manual';
}

export interface SharingPost {
  id: string;
  title: string;
  ingredientName: string;
  category: CategoryType;
  quantity: string;
  storage: StorageType;
  expiryDate: string;
  location: string; // e.g. "신촌동", "대학동", "안암동"
  distanceKm: number;
  type: 'free' | 'exchange';
  exchangeWant?: string; // e.g., "대파 half단 or 양파 1개와 교환 원해요"
  status: 'available' | 'reserved' | 'completed';
  author: {
    id: string;
    name: string;
    avatar: string;
    area: string;
  };
  createdAt: string;
  imageUrl?: string;
  description: string;
  likes: number;
}

export interface SharingRecord {
  id: string;
  postTitle: string;
  ingredientName: string;
  quantity: string;
  partnerName: string;
  type: 'given' | 'received'; // 나눔함 vs 나눔받음
  date: string;
  savedMoney: number; // 원
  wastePreventedKg: number; // kg
  co2PreventedKg: number; // kg CO2
}

export interface UserProfile {
  id: string;
  name: string;
  location: string;
  university?: string;
  badgeLevel: string;
  totalSavedMoney: number;
  totalWastePreventedKg: number;
  totalCo2PreventedKg: number;
  completedShareCount: number;
}

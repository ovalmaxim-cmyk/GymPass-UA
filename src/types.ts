/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Gym {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  categories: string[];
  facilities: string[];
  tier: "Лайт" | "Стандарт" | "Ультра";
  coordinates: { x: number; y: number }; // Percentage offsets in visual maps
  description: string;
  phone: string;
  schedule: string;
}

export interface SubscriptionPackage {
  id: string;
  name: "Лайт" | "Стандарт" | "Ультра" | "Сімейний";
  price: number;
  lessonsCount: number | "Безліміт";
  description: string;
  features: string[];
  color: string;
  bgGradient: string;
}

export interface VisitLog {
  id: string;
  gymId: string;
  gymName: string;
  date: string;
  time: string;
  qrCodeUsed: string;
  status: "активний" | "завершено" | "скасовано";
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  currentCity: string;
  balanceLessons: number | "Безліміт";
  currentTier: "Лайт" | "Стандарт" | "Ультра" | "Сімейний" | null;
  currentStreak: number;
  totalWorkouts: number;
  activePassQr: string | null;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface SupportRequest {
  id: string;
  category: string;
  message: string;
  email: string;
  phone: string;
  userName: string;
  date: string;
  time: string;
  status: "новий" | "в процесі" | "вирішено";
  replyContent?: string;
}

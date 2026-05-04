// Type definitions for survey taker frontend

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number; // minutes
  reward: number; // monetary reward
  totalResponses: number;
  maxResponses: number;
}

export interface Wallet {
  balance: number;
  totalEarned: number;
  currency: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  language: string; // language code, e.g., "km" or "en"
  avatar: string; // URL to avatar image
}

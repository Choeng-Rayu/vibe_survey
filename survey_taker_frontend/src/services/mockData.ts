/**
 * Mock Data for Development
 */

import { User, Survey, Wallet } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Somnang',
  phone: '+855 98 765 4321',
  language: 'km',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Somnang',
};

export const mockWallet: Wallet = {
  balance: 45.75,
  totalEarned: 156.25,
  currency: 'USD',
};

export const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Online Shopping Preferences',
    description: 'Help us understand your shopping habits',
    category: 'E-Commerce',
    estimatedTime: 5,
    reward: 2.5,
    totalResponses: 342,
    maxResponses: 1000,
  },
  {
    id: '2',
    title: 'Mobile App Usage',
    description: 'Share your app usage patterns',
    category: 'Technology',
    estimatedTime: 3,
    reward: 1.5,
    totalResponses: 127,
    maxResponses: 500,
  },
  {
    id: '3',
    title: 'Food & Beverage',
    description: 'Tell us your food preferences',
    category: 'Lifestyle',
    estimatedTime: 4,
    reward: 3.0,
    totalResponses: 89,
    maxResponses: 300,
  },
];

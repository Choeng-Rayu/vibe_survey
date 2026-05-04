'use client';

import { Header } from '@/components/Header';
import { WalletBalance } from '@/components/WalletBalance';
import { SurveyCard } from '@/components/SurveyCard';
import { mockUser, mockWallet, mockSurveys } from '@/services/mockData';
import { useState } from 'react';

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'E-Commerce', 'Technology', 'Lifestyle'];
  
  const filteredSurveys =
    selectedCategory === 'All'
      ? mockSurveys
      : mockSurveys.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-cream">
      <Header user={mockUser} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <section className="mb-16">
          <h1 className="text-5xl font-cormorant font-semibold text-text-primary mb-3 leading-tight">
            Welcome back, {mockUser.name}
          </h1>
          <p className="text-lg text-text-muted max-w-2xl">
            Complete surveys at your own pace and earn real money. Every response matters.
          </p>
        </section>

        {/* Wallet Section */}
        <section className="mb-16">
          <WalletBalance wallet={mockWallet} />
        </section>

        {/* Surveys Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-cormorant font-semibold text-text-primary">Available Surveys</h2>
          </div>

          {/* Filter */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-sage-500 text-white'
                    : 'bg-white border border-sage-200 text-text-muted hover:border-sage-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Survey Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sage-100 mt-16 py-8 text-center text-text-muted">
        <p className="text-sm">&copy; 2026 Vibe Survey. All rights reserved.</p>
      </footer>
    </div>
  );
}

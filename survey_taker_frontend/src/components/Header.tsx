'use client';

import { User } from '@/types';

interface HeaderProps {
  user?: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="w-full bg-cream border-b border-sage-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        
        {/* Logo - Left */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage-300 rounded flex items-center justify-center">
            <span className="text-sage-600 font-cormorant font-bold text-sm">V</span>
          </div>
          <span className="font-cormorant font-semibold text-lg italic text-text-primary">
            Vibe Survey
          </span>
        </div>

        {/* Navigation - Center */}
        <nav className="flex gap-8 flex-1 justify-center">
          <a href="#home" className="text-text-muted hover:text-sage-600 text-sm font-dm transition-colors">
            Home
          </a>
          <a href="#features" className="text-text-muted hover:text-sage-600 text-sm font-dm transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-text-muted hover:text-sage-600 text-sm font-dm transition-colors">
            How it works
          </a>
          <a href="#about" className="text-text-muted hover:text-sage-600 text-sm font-dm transition-colors">
            About
          </a>
          <a href="#contact" className="text-text-muted hover:text-sage-600 text-sm font-dm transition-colors">
            Contact
          </a>
        </nav>

        {/* Right Icons & Buttons */}
        <div className="flex items-center gap-6">
          {/* Wallet Icon */}
          <button aria-label="Wallet and rewards" className="text-text-muted hover:text-sage-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* User Profile Icon */}
          <button aria-label="User profile" className="text-text-muted hover:text-sage-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
'use client';

import { User } from '@/types';

interface HeaderProps {
  user?: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-sage-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-cormorant font-bold text-lg">V</span>
          </div>
          <span className="font-cormorant font-semibold text-lg text-text-primary hidden sm:inline">
            Vibe Survey
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-text-muted hover:text-sage-600 text-sm font-medium transition-colors">
            Surveys
          </a>
          <a href="#" className="text-text-muted hover:text-sage-600 text-sm font-medium transition-colors">
            Wallet
          </a>
          <a href="#" className="text-text-muted hover:text-sage-600 text-sm font-medium transition-colors">
            Profile
          </a>
        </nav>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-text-primary hidden sm:inline">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}

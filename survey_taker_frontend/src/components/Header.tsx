'use client';

import { User } from '@/types';

interface HeaderProps {
  user?: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="w-screen bg-cream border-b-4 border-sage-600 sticky top-0 z-50">
      <div className="w-full px-8 py-4 flex justify-between items-center h-24">
        
        {/* Logo - Left */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-sage-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-cormorant font-bold text-lg">VS</span>
          </div>
          <span className="font-cormorant font-semibold text-2xl text-text-primary">
            Vibe Survey
          </span>
        </div>

        {/* Navigation - Center */}
        <nav className="hidden lg:flex flex-1 justify-center gap-12">
          <a href="#home" className="text-text-muted hover:text-sage-600 text-base font-medium transition-colors">
            Home
          </a>
          <a href="#features" className="text-text-muted hover:text-sage-600 text-base font-medium transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-text-muted hover:text-sage-600 text-base font-medium transition-colors">
            How it works
          </a>
          <a href="#about" className="text-text-muted hover:text-sage-600 text-base font-medium transition-colors">
            About
          </a>
          <a href="#contact" className="text-text-muted hover:text-sage-600 text-base font-medium transition-colors">
            Contact
          </a>
        </nav>

        {/* CTA Buttons - Right */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button className="text-text-primary hover:text-sage-600 text-sm font-medium transition-colors">
            SIGN IN
          </button>
          <button className="bg-sage-500 hover:bg-sage-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
            GET STARTED
          </button>
        </div>
      </div>
    </header>
  );
}
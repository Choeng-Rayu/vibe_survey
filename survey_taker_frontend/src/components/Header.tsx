'use client';

import Link from 'next/link';
import { User } from '@/types';

interface HeaderProps {
  user?: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="w-full sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-sage-100/60">
      <div className="max-w-7xl mx-auto px-8 py-0 h-16 flex justify-between items-center gap-8">

        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-sage-200 flex items-center justify-center ring-1 ring-sage-300/60 group-hover:bg-sage-300 transition-colors duration-200">
            <svg className="w-4 h-4 text-sage-700" viewBox="0 0 16 16" fill="none">
              <path d="M8 2C5 2 2 4.5 2 8s3 6 6 6 6-2.5 6-6-2.5-6-6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M5.5 8.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="6" cy="6.5" r="0.75" fill="currentColor"/>
              <circle cx="10" cy="6.5" r="0.75" fill="currentColor"/>
            </svg>
          </div>
          <span className="font-cormorant font-semibold text-xl italic text-text-primary tracking-tight">
            Vibe Survey
          </span>
        </Link>

        {/* Navigation - Center */}
        <nav className="flex items-center gap-1 flex-1 justify-center">
          {['Home', 'Features', 'How it works', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative px-3 py-2 text-sm font-dm text-text-muted hover:text-text-primary transition-colors duration-200 group"
            >
              {item}
              <span className="absolute bottom-1 left-3 right-3 h-px bg-sage-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </a>
          ))}
        </nav>

        {/* Right - Icons & CTA */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Wallet Icon */}
          <button
            aria-label="Wallet and rewards"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-sage-700 hover:bg-sage-100 transition-all duration-200"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-sage-200" />

          {/* User Profile or Sign In */}
          {user ? (
            <button
              aria-label="User profile"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-sage-700 hover:bg-sage-100 transition-all duration-200"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          ) : (
            <>
              <a
                href="#signin"
                className="text-sm font-dm text-text-muted hover:text-text-primary transition-colors duration-200 px-3 py-2"
              >
                Sign in
              </a>
              <a
                href="#signup"
                className="text-sm font-dm font-medium bg-text-primary text-cream px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors duration-200 whitespace-nowrap"
              >
                Start earning
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle email signup
    console.log('Signup email:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(124, 158, 138, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-cormorant font-bold text-lg" style={{ background: 'linear-gradient(135deg, #7C9E8A, #6A8C78)' }}>
              V
            </div>
            <span className="font-cormorant font-semibold text-lg" style={{ color: '#1C1C1A' }}>Vibe Survey</span>
          </div>
          <nav className="flex gap-8 items-center">
            <a href="#features" className="text-sm font-medium transition-colors" style={{ color: '#6B6860' }}>Features</a>
            <a href="#stats" className="text-sm font-medium transition-colors" style={{ color: '#6B6860' }}>Stats</a>
            <button className="px-5 py-2 text-sm font-medium transition-colors" style={{ color: '#6B6860' }}>Sign In</button>
            <button className="px-6 py-2.5 text-white rounded-full font-medium text-sm transition-all" style={{ background: 'linear-gradient(135deg, #7C9E8A, #6A8C78)' }}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ paddingTop: '120px', paddingBottom: '120px' }} className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          {/* Subtle background decoration */}
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl -z-10" style={{ backgroundColor: '#7C9E8A' }}></div>
          <div className="absolute -bottom-40 left-0 w-96 h-96 rounded-full opacity-5 blur-3xl -z-10" style={{ backgroundColor: '#C4956A' }}></div>

          <h1 className="font-cormorant text-6xl md:text-7xl font-semibold mb-8 leading-tight" style={{ color: '#1C1C1A', letterSpacing: '-0.02em' }}>
            Earn Money by<br />Sharing Your Opinion
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B6860' }}>
            Your feedback is valuable. Complete surveys at your pace and get rewarded with real money. No hidden fees, transparent rewards, and fast withdrawals.
          </p>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3.5 rounded-full border text-base transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'white',
                borderColor: 'rgba(124, 158, 138, 0.2)',
                color: '#1C1C1A',
              }}
            />
            <button
              type="submit"
              className="px-8 py-3.5 text-white rounded-full font-semibold transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #7C9E8A, #6A8C78)' }}
            >
              Start Free
            </button>
          </form>

          <p className="text-sm" style={{ color: '#6B6860' }}>
            No credit card required. Start earning in 2 minutes.
          </p>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section style={{ backgroundColor: '#F2EDE5', paddingTop: '60px', paddingBottom: '60px', borderTop: '1px solid rgba(124, 158, 138, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-cormorant text-4xl font-semibold mb-2" style={{ color: '#7C9E8A' }}>50K+</p>
              <p className="text-sm uppercase tracking-wide" style={{ color: '#6B6860' }}>Active Users</p>
            </div>
            <div>
              <p className="font-cormorant text-4xl font-semibold mb-2" style={{ color: '#7C9E8A' }}>$2.5M+</p>
              <p className="text-sm uppercase tracking-wide" style={{ color: '#6B6860' }}>Paid Out</p>
            </div>
            <div>
              <p className="font-cormorant text-4xl font-semibold mb-2" style={{ color: '#7C9E8A' }}>15K+</p>
              <p className="text-sm uppercase tracking-wide" style={{ color: '#6B6860' }}>Surveys</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ paddingTop: '120px', paddingBottom: '120px', borderTop: '1px solid rgba(124, 158, 138, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-cormorant text-5xl font-semibold mb-6" style={{ color: '#1C1C1A' }}>
              Why Choose Vibe Survey?
            </h2>
            <p style={{ color: '#6B6860' }}>
              We&apos;ve reimagined the survey experience to be rewarding, respectful, and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card group cursor-pointer" style={{ backgroundColor: 'white', borderColor: 'rgba(124, 158, 138, 0.1)' }}>
              <div className="text-5xl mb-6">💰</div>
              <h3 className="font-cormorant text-2xl font-semibold mb-3" style={{ color: '#1C1C1A' }}>
                Real Rewards
              </h3>
              <p style={{ color: '#6B6860' }} className="mb-6">
                Earn genuine USD for every completed survey. Fast withdrawals to your preferred payment method.
              </p>
              <div className="h-1 rounded-full transition-all duration-500 group-hover:w-full" style={{ width: '48px', backgroundColor: '#7C9E8A' }}></div>
            </div>

            {/* Feature 2 */}
            <div className="card group cursor-pointer" style={{ backgroundColor: 'white', borderColor: 'rgba(124, 158, 138, 0.1)' }}>
              <div className="text-5xl mb-6">⏱️</div>
              <h3 className="font-cormorant text-2xl font-semibold mb-3" style={{ color: '#1C1C1A' }}>
                Your Time, Your Rules
              </h3>
              <p style={{ color: '#6B6860' }} className="mb-6">
                Complete surveys whenever you want. Take a few minutes or an hour — you control your schedule.
              </p>
              <div className="h-1 rounded-full transition-all duration-500 group-hover:w-full" style={{ width: '48px', backgroundColor: '#7C9E8A' }}></div>
            </div>

            {/* Feature 3 */}
            <div className="card group cursor-pointer" style={{ backgroundColor: 'white', borderColor: 'rgba(124, 158, 138, 0.1)' }}>
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="font-cormorant text-2xl font-semibold mb-3" style={{ color: '#1C1C1A' }}>
                Your Opinion Counts
              </h3>
              <p style={{ color: '#6B6860' }} className="mb-6">
                Help companies understand their customers better. Your feedback shapes the products you love.
              </p>
              <div className="h-1 rounded-full transition-all duration-500 group-hover:w-full" style={{ width: '48px', backgroundColor: '#7C9E8A' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Testimonial Section */}
      <section id="stats" style={{ paddingTop: '120px', paddingBottom: '120px', backgroundColor: '#F2EDE5', borderTop: '1px solid rgba(124, 158, 138, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-cormorant text-5xl font-semibold mb-8" style={{ color: '#1C1C1A' }}>
            Trusted by Communities Worldwide
          </h2>
          <p style={{ color: '#6B6860' }} className="text-lg max-w-2xl mx-auto mb-16">
            Join thousands of survey takers earning real, transparent rewards. Our platform is built on trust, fairness, and respect.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div style={{ backgroundColor: 'white', borderColor: 'rgba(124, 158, 138, 0.1)' }} className="card">
              <p className="text-sm mb-4" style={{ color: '#6B6860' }}>
                &quot;I make $200+ every month just by sharing my thoughts. No spam, no tricks!&quot;
              </p>
              <p style={{ color: '#1C1C1A' }} className="font-dm font-semibold">— Sarah M.</p>
            </div>

            <div style={{ backgroundColor: 'white', borderColor: 'rgba(124, 158, 138, 0.1)' }} className="card">
              <p className="text-sm mb-4" style={{ color: '#6B6860' }}>
                &quot;The most transparent survey platform I&apos;ve used. Payouts are fast and reliable.&quot;
              </p>
              <p style={{ color: '#1C1C1A' }} className="font-dm font-semibold">— James T.</p>
            </div>

            <div style={{ backgroundColor: 'white', borderColor: 'rgba(124, 158, 138, 0.1)' }} className="card">
              <p className="text-sm mb-4" style={{ color: '#6B6860' }}>
                &quot;Finally, a platform that respects your time and pays fairly. Highly recommended!&quot;
              </p>
              <p style={{ color: '#1C1C1A' }} className="font-dm font-semibold">— Emma R.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{ paddingTop: '120px', paddingBottom: '120px', borderTop: '1px solid rgba(124, 158, 138, 0.1)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-cormorant text-5xl font-semibold mb-8" style={{ color: '#1C1C1A' }}>
            Start Earning Today
          </h2>
          <p style={{ color: '#6B6860' }} className="text-lg mb-12 max-w-2xl mx-auto">
            Sign up in 2 minutes and complete your first survey immediately. Get instant access to thousands of opportunities.
          </p>

          <Link href="/dashboard">
            <button
              className="px-10 py-4 text-white rounded-full font-semibold transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #7C9E8A, #6A8C78)' }}
            >
              Create Your Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#F2EDE5', borderTop: '1px solid rgba(124, 158, 138, 0.1)', paddingTop: '80px', paddingBottom: '40px' }}>
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 pb-12" style={{ borderBottom: '1px solid rgba(124, 158, 138, 0.1)' }}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-cormorant font-bold text-sm" style={{ background: 'linear-gradient(135deg, #7C9E8A, #6A8C78)' }}>
                  V
                </div>
                <span className="font-cormorant font-semibold" style={{ color: '#1C1C1A' }}>Vibe Survey</span>
              </div>
              <p className="text-sm" style={{ color: '#6B6860' }}>Empowering people to earn by sharing their valuable opinions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ color: '#1C1C1A' }}>Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>How it Works</a></li>
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>Pricing</a></li>
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ color: '#1C1C1A' }}>Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>Help Center</a></li>
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>Contact Us</a></li>
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4" style={{ color: '#1C1C1A' }}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>Privacy</a></li>
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>Terms</a></li>
                <li><a href="#" className="text-sm transition-colors" style={{ color: '#6B6860' }}>Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm" style={{ color: '#6B6860' }}>
            <p>&copy; 2026 Vibe Survey. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Features data
  const features = [
    {
      id: 1,
      icon: '/images/sign_in.png',
      title: 'Sign up',
      description: 'Create your account in seconds. Share basic info to get started earning.',
    },
    {
      id: 2,
      icon: '/images/complete.png',
      title: 'Complete surveys',
      description: 'Answer surveys matched to your profile. Each one takes just a few minutes.',
    },
    {
      id: 3,
      icon: '/images/earn_withdraw.png',
      title: 'Earn & withdraw',
      description: 'Get rewarded instantly. Withdraw your earnings anytime, anywhere.',
    },
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="first-container">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold text-text-primary leading-tight font-cormorant mb-6">
            Earn Money by <br />
            <span className="text-[#6A8C78]">Sharing</span>{" "}
            Your Opinion
          </h1>
          <h3 className="font-dm text-text-muted">
            Transforms your insight into accurate rewards.
          </h3>
          <div className="button-group mt-6">
            <button className="btn-primary font-dm">
              GET STARTED
            </button>
            <Link href="/how-it-works" className="btn-secondary font-dm inline-flex items-center justify-center">
              How it works
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-[#F0F4F2] mt-40 py-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-center px-8">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-text-primary font-cormorant">
              50,000+
            </h2>
            <p className="text-xs tracking-widest text-text-muted mt-3 font-dm">
              ACTIVE USERS
            </p>
          </div>
          <div className="w-px h-12 bg-text-muted opacity-30"></div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-[#6A8C78] font-cormorant">
              $2M+
            </h2>
            <p className="text-xs tracking-widest text-text-muted mt-3 font-dm">
              TOTAL PAYOUTS
            </p>
          </div>
          <div className="w-px h-12 bg-text-muted opacity-30"></div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-text-primary font-cormorant">
              500k+
            </h2>
            <p className="text-xs tracking-widest text-text-muted mt-3 font-dm">
              SURVEYS COMPLETED
            </p>
          </div>
        </div>
      </section>

      {/* Simply Elegant Section - Features */}
      <section className="bg-cream py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <p className="text-text-muted text-sm tracking-widest font-dm mb-4 uppercase">
              THE PROCESS
            </p>
            <h2 className="text-5xl font-cormorant text-text-primary mb-2">
              Simply Elegant
            </h2>
          </div>

          {/* Features with Connecting Line */}
          <div className="relative">
            {/* SVG Connecting Line - solid line through icons */}
            <svg className="absolute top-0 left-0 right-0 w-full h-32 pointer-events-none" preserveAspectRatio="none">
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#E5DDD2" strokeWidth="1" />
            </svg>

            <div className="flex items-flex-start justify-between gap-12 relative z-10">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-sage-100 flex items-center justify-center mb-8 shadow-soft relative">
                  <Image src={features[0].icon} alt={features[0].title} width={48} height={48} className="object-contain" />
                </div>
                <h3 className="text-xl font-cormorant text-text-primary mb-3">
                  {features[0].title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {features[0].description}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-sage-100 flex items-center justify-center mb-8 shadow-soft relative">
                  <Image src={features[1].icon} alt={features[1].title} width={48} height={48} className="object-contain" />
                </div>
                <h3 className="text-xl font-cormorant text-text-primary mb-3">
                  {features[1].title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {features[1].description}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-sage-100 flex items-center justify-center mb-8 shadow-soft relative">
                  <Image src={features[2].icon} alt={features[2].title} width={48} height={48} className="object-contain" />
                </div>
                <h3 className="text-xl font-cormorant text-text-primary mb-3">
                  {features[2].title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {features[2].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Rewards Section */}
      <section className="bg-cream py-20 mb-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-cormorant text-text-primary mb-4">
              Real rewards for real insights.
            </h2>
            <p className="text-text-muted mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              We believe your opinions matter. That&apos;s why we offer competitive rewards for your time and insights. Your contributions are valued with transparent, fair compensation.
            </p>
            <ul className="space-y-3 mb-10 max-w-2xl mx-auto">
              <li className="flex items-center justify-center gap-3">
                <span className="text-primary">✓</span>
                <span className="text-text-muted">Competitive rewards for every survey</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="text-primary">✓</span>
                <span className="text-text-muted">Instant payment to your account</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <span className="text-primary">✓</span>
                <span className="text-text-muted">No hidden fees or restrictions</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center mb-12">
            <button className="btn-primary font-dm">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
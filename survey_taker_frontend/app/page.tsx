export default function Home() {
  // Features data
  const features = [
    {
      id: 1,
      icon: '📝',
      title: 'Sign up',
      description: 'Create your account in seconds. Share basic info to get started earning.',
    },
    {
      id: 2,
      icon: '✓',
      title: 'Complete surveys',
      description: 'Answer surveys matched to your profile. Each one takes just a few minutes.',
    },
    {
      id: 3,
      icon: '💰',
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
            <button className="btn-secondary font-dm">
              How it works
            </button>
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
          <div className="relative pt-16">
            {/* Background connecting line */}
            <div className="absolute top-6 left-0 right-0 h-px bg-sage-200"></div>

            <div className="flex items-flex-start justify-between gap-12">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-sage-100 flex items-center justify-center text-4xl mb-8 relative z-10 shadow-soft">
                  {features[0].icon}
                </div>
                <h3 className="text-lg font-cormorant text-text-primary mb-3">
                  {features[0].title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {features[0].description}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-sage-100 flex items-center justify-center text-4xl mb-8 relative z-10 shadow-soft">
                  {features[1].icon}
                </div>
                <h3 className="text-lg font-cormorant text-text-primary mb-3">
                  {features[1].title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {features[1].description}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-sage-100 flex items-center justify-center text-4xl mb-8 relative z-10 shadow-soft">
                  {features[2].icon}
                </div>
                <h3 className="text-lg font-cormorant text-text-primary mb-3">
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
      <section className="bg-cream py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h2 className="text-3xl font-cormorant text-text-primary mb-4">
                Real rewards for real insights.
              </h2>
              <p className="text-text-muted mb-6 text-lg leading-relaxed">
                We believe your opinions matter. That&apos;s why we offer competitive rewards for your time and insights. Your contributions are valued with transparent, fair compensation.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-text-muted">Competitive rewards for every survey</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-text-muted">Instant payment to your account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-text-muted">No hidden fees or restrictions</span>
                </li>
              </ul>
              <button className="btn-primary font-dm">
                Learn More
              </button>
            </div>

            {/* Right: Placeholder for Image */}
            <div className="bg-surface rounded-2xl h-80 flex items-center justify-center border border-sage-200 shadow-soft">
              <div className="text-center">
                <div className="text-4xl mb-4">🎁</div>
                <p className="text-text-muted font-dm">Image Placeholder</p>
                <p className="text-text-muted text-xs font-dm mt-2">Premium Insight</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Reliability Section */}
      <section className="bg-cream py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Placeholder for Image */}
            <div className="bg-surface rounded-2xl h-80 flex items-center justify-center border border-sage-200 shadow-soft">
              <div className="text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <p className="text-text-muted font-dm">Image Placeholder</p>
                <p className="text-text-muted text-xs font-dm mt-2">Trusted platform</p>
              </div>
            </div>

            {/* Right: Text Content */}
            <div>
              <h2 className="text-3xl font-cormorant text-text-primary mb-4">
                Trusted platform
              </h2>
              <p className="text-text-muted mb-6 text-lg leading-relaxed">
                Your trust is our priority. We maintain the highest standards of security and privacy to protect your data and rewards.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-text-muted">Secure data encryption</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-text-muted">Privacy guaranteed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-text-muted">Verified & certified</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-text-primary py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-cormorant text-cream mb-6">
            Start earning today
          </h2>
          <p className="text-cream text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of survey takers who are already earning rewards. Sign up now and take your first survey.
          </p>
          <button className="btn-primary font-dm mb-4">
            GET STARTED
          </button>
          <p className="text-cream text-sm font-dm">
            or browse <a href="#" className="text-sage-400 hover:text-white underline">featured surveys</a>
          </p>
        </div>
      </section>
    </main>
  );
}
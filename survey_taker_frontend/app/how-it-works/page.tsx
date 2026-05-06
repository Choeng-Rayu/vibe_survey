'use client';

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sage-600 font-cormorant text-lg italic mb-4">OUR PROCESS</p>
          <h1 className="text-5xl md:text-6xl font-cormorant font-bold text-text-primary mb-6">
            How It Works
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Four simple steps to start earning money by sharing your valuable opinions with brands that care about what you think.
          </p>
        </div>
      </section>

      {/* Step-by-Step Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            {/* Step 1 */}
            <div className="order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-soft bg-gradient-to-br from-sage-100 to-sage-50 h-80">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  📝
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">1</span>
                </div>
                <h2 className="text-4xl font-cormorant font-bold text-text-primary">Create Your Profile</h2>
              </div>
              <p className="text-lg text-text-muted mb-6 leading-relaxed">
                Sign up in seconds with just your basic information. Tell us about your interests, demographics, and preferences so we can match you with surveys that are perfect for you.
              </p>
              <ul className="space-y-3">
                {['Quick registration process', 'Personalized profile setup', 'Privacy protection guaranteed'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-muted">
                    <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">2</span>
                </div>
                <h2 className="text-4xl font-cormorant font-bold text-text-primary">Browse & Select Surveys</h2>
              </div>
              <p className="text-lg text-text-muted mb-6 leading-relaxed">
                Browse through a curated list of available surveys tailored to your profile. Each survey shows the estimated time and reward amount upfront so you know exactly what you&apos;ll earn.
              </p>
              <ul className="space-y-3">
                {['Personalized survey recommendations', 'Clear time & reward estimates', 'Real-time availability updates'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-muted">
                    <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="rounded-3xl overflow-hidden shadow-soft bg-gradient-to-br from-accent/20 to-accent/10 h-80">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🎯
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-soft bg-gradient-to-br from-sage-100 to-sage-50 h-80">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  ✍️
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h2 className="text-4xl font-cormorant font-bold text-text-primary">Complete the Survey</h2>
              </div>
              <p className="text-lg text-text-muted mb-6 leading-relaxed">
                Answer thoughtfully crafted questions from leading brands. Your genuine opinions are valuable, and we ensure every survey is respectful of your time and intelligence.
              </p>
              <ul className="space-y-3">
                {['Professional survey design', 'Quality validation checks', 'Fair compensation always'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-muted">
                    <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">4</span>
                </div>
                <h2 className="text-4xl font-cormorant font-bold text-text-primary">Earn & Withdraw</h2>
              </div>
              <p className="text-lg text-text-muted mb-6 leading-relaxed">
                Earn instantly after survey completion. Withdraw your earnings anytime to your preferred payment method with zero hidden fees or minimum balance requirements.
              </p>
              <ul className="space-y-3">
                {['Instant payment processing', 'Multiple withdrawal methods', 'No hidden fees'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-muted">
                    <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="rounded-3xl overflow-hidden shadow-soft bg-gradient-to-br from-accent/20 to-accent/10 h-80">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  💰
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sage-600 font-cormorant text-lg italic mb-4">QUESTIONS?</p>
            <h2 className="text-5xl font-cormorant font-bold text-text-primary">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              { question: 'How much can I earn?', answer: 'Earnings vary based on survey length and complexity, typically ranging from $0.50 to $10+ per survey. Top contributors earn $100-300+ monthly.' },
              { question: 'How often will I receive surveys?', answer: 'Survey availability depends on your profile match with brand requirements. Most users receive 5-15 surveys per week, though active members can receive more.' },
              { question: 'When do I get paid?', answer: 'Payments are processed instantly after survey completion. You can withdraw to your account anytime without minimum balance requirements.' },
              { question: 'Is my data safe?', answer: 'Yes. We use industry-leading encryption and never sell your personal data. Your privacy is our top priority and fully protected by our privacy policy.' },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-sage-100/50 shadow-soft hover:shadow-md transition-shadow">
                <h3 className="text-lg font-cormorant font-bold text-text-primary mb-3">{faq.question}</h3>
                <p className="text-text-muted font-dm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-sage-600 to-sage-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-cormorant font-bold text-white mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of people already earning money by sharing their opinions. It takes just minutes to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-sage-600 font-dm font-semibold rounded-full hover:bg-white/90 transition-all duration-200 shadow-soft">
              Get Started Now
            </button>
            <button className="px-10 py-4 bg-white/20 text-white font-dm font-semibold rounded-full border border-white/40 hover:bg-white/30 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

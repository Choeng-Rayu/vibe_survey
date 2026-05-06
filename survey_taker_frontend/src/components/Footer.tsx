'use client';

import Link from 'next/link';

const LINKS = {
  Learn: ['What is Vibe Survey?', 'How Does It Work?', 'Survey Categories', 'Earning Tips', 'Account Security', "What's New"],
  Resources: ['Getting Started', 'FAQ', 'Survey Guidelines', 'Payment Methods', 'Community Guidelines', 'Blog & Tips'],
  Creators: ['Creator Dashboard', 'Build Surveys', 'Analytics Tools', 'Survey Templates', 'API Documentation', 'Developer Tools'],
  Help: ['Contact Us', 'Support Tickets', 'Report Issue', 'Knowledge Base', 'Support Overview', 'Get Expert Help'],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text-primary text-white">

      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-cormorant text-2xl font-semibold italic text-white">Stay in the loop</p>
            <p className="text-sm font-dm text-white/50 mt-1">New surveys, tips & earnings updates — weekly.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-64 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm font-dm text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button className="bg-white text-text-primary font-dm font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-white/90 active:scale-[0.98] transition-all duration-150 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center ring-1 ring-white/20">
                <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C5 2 2 4.5 2 8s3 6 6 6 6-2.5 6-6-2.5-6-6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M5.5 8.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="6" cy="6.5" r="0.75" fill="currentColor"/>
                  <circle cx="10" cy="6.5" r="0.75" fill="currentColor"/>
                </svg>
              </div>
              <span className="font-cormorant font-semibold text-xl italic text-white tracking-tight">
                Vibe Survey
              </span>
            </Link>
            <p className="text-sm font-dm text-white/50 leading-relaxed">
              Share your opinion. Get rewarded. It&apos;s that simple.
            </p>
            {/* Social Icons */}
            <div className="flex gap-2 mt-1">
              {[
                { label: 'Twitter', path: 'M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { label: 'Instagram', path: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4 className="font-cormorant font-semibold text-base text-white">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm font-dm text-white/50 hover:text-white/90 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-dm text-white/40">
            &copy; {currentYear} Vibe Survey. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs font-dm text-white/40 hover:text-white/70 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
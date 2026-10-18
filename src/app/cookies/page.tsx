import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | Airlink Broadband',
  description: 'Cookie Policy for Airlink Broadband — what cookies we use and how to manage them.',
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12">
          <span className="text-[#FBBF24] font-black text-xs tracking-[0.3em] uppercase mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-[#0A192F]/50 text-sm font-medium">Last updated: July 2026 · Sriram Broadband Services Pvt. Ltd.</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-[#E5E7EB] p-8 md:p-12 space-y-8 text-[#0A192F]/70 leading-relaxed">

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences and improve your browsing experience. Cookies cannot execute programs or deliver viruses to your device.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">How We Use Cookies</h2>

            <div className="space-y-4">
              <div className="bg-[#F7F8FA] rounded-xl p-5">
                <h3 className="font-black text-[#0A192F] mb-1">Essential Cookies</h3>
                <p className="text-sm">
                  Required for the website to function. They enable core features like user authentication, session management, and security. These cannot be disabled.
                </p>
                <p className="text-xs text-[#0A192F]/40 mt-2 font-bold uppercase tracking-widest">Examples: auth session token, CSRF token</p>
              </div>

              <div className="bg-[#F7F8FA] rounded-xl p-5">
                <h3 className="font-black text-[#0A192F] mb-1">Analytics Cookies</h3>
                <p className="text-sm">
                  Help us understand how visitors use our site — which pages are most visited, how long users stay, and where they come from. This data is aggregated and anonymised.
                </p>
                <p className="text-xs text-[#0A192F]/40 mt-2 font-bold uppercase tracking-widest">Examples: Google Analytics (_ga, _gid)</p>
              </div>

              <div className="bg-[#F7F8FA] rounded-xl p-5">
                <h3 className="font-black text-[#0A192F] mb-1">Functional Cookies</h3>
                <p className="text-sm">
                  Remember your preferences (such as language or region) to provide a more personalised experience.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">Third-Party Cookies</h2>
            <p>
              Our website may include content or services from third parties (such as Google Analytics, embedded maps, or chat widgets). These third parties may set their own cookies subject to their own privacy policies. We do not control these cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">Managing Cookies</h2>
            <p className="mb-3">
              You can control and delete cookies through your browser settings. Please note that disabling cookies may affect the functionality of this website. Below are links to cookie management guides for common browsers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] font-semibold hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] font-semibold hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] font-semibold hover:underline">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] font-semibold hover:underline">Microsoft Edge</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">Contact</h2>
            <p>
              For questions about our cookie practices, contact us at{' '}
              <a href="mailto:info@srirambroadband.com" className="text-[#FBBF24] font-semibold hover:underline">info@srirambroadband.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-8 flex gap-6">
          <Link href="/privacy" className="text-sm font-black text-[#0A192F]/40 hover:text-[#FBBF24] transition-colors uppercase tracking-widest">Privacy Policy</Link>
          <Link href="/terms" className="text-sm font-black text-[#0A192F]/40 hover:text-[#FBBF24] transition-colors uppercase tracking-widest">Terms of Service</Link>
        </div>
      </div>
    </main>
  );
}

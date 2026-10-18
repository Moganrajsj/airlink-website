import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Airlink Broadband',
  description: 'Terms of Service for Airlink Broadband (Sriram Broadband Services Pvt. Ltd.) — your rights and obligations when using our internet services.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12">
          <span className="text-[#FBBF24] font-black text-xs tracking-[0.3em] uppercase mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight mb-4">Terms of Service</h1>
          <p className="text-[#0A192F]/50 text-sm font-medium">Last updated: July 2026 · Sriram Broadband Services Pvt. Ltd.</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-[#E5E7EB] p-8 md:p-12 space-y-8 text-[#0A192F]/70 leading-relaxed">

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the website{' '}
              <a href="https://www.srirambroadband.com" className="text-[#FBBF24] font-semibold hover:underline">www.srirambroadband.com</a>{' '}
              or subscribing to any service provided by Sriram Broadband Services Private Limited ("Airlink Broadband"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site or our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">2. Services</h2>
            <p>
              Airlink Broadband provides residential fiber broadband, enterprise leased line, SD-WAN, and related telecommunications services under a licence issued by the Department of Telecommunications, Government of India. Service availability is subject to technical feasibility in your area.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">3. Subscriber Obligations</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You must provide accurate personal information during registration and promptly update it if it changes.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You may not use our services for any unlawful purpose, including but not limited to transmitting unsolicited communications (spam), distributing malware, or accessing systems without authorisation.</li>
              <li>You agree to comply with all applicable Indian laws, including the IT Act 2000 and the Indian Telegraph Act 1885.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">4. Fair Usage Policy (FUP)</h2>
            <p>
              Unless explicitly stated as "unlimited" in your plan, monthly data usage may be subject to a Fair Usage Policy. After exceeding the stated FUP threshold, speeds may be reduced. Details are specified in your plan documentation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">5. Billing &amp; Payment</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Services are billed in advance on a monthly or annual basis as per your chosen plan.</li>
              <li>Non-payment may result in service suspension after a 7-day grace period following the due date.</li>
              <li>Refunds, if applicable, are processed within 7–10 working days and are subject to our refund policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">6. Service Availability &amp; Uptime</h2>
            <p>
              While we target 99.9% uptime, we do not guarantee uninterrupted service. We are not liable for outages caused by events beyond our control (force majeure), including natural disasters, government orders, or third-party network failures.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">7. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos, and software — is the property of Sriram Broadband Services Pvt. Ltd. and is protected under Indian intellectual property laws. Unauthorised reproduction or distribution is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Airlink Broadband shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services or website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">9. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms shall be governed by the laws of India. Any disputes arising out of these Terms shall be subject to the exclusive jurisdiction of the courts in Dharmapuri, Tamil Nadu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">10. Contact</h2>
            <div className="bg-[#F7F8FA] rounded-xl p-5 space-y-1">
              <p className="font-black text-[#0A192F]">Sriram Broadband Services Private Limited</p>
              <p>Dharmapuri &amp; Chennai, Tamil Nadu, India</p>
              <p>Email: <a href="mailto:info@srirambroadband.com" className="text-[#FBBF24] font-semibold hover:underline">info@srirambroadband.com</a></p>
              <p>Phone: <a href="tel:+919344584000" className="text-[#FBBF24] font-semibold hover:underline">+91 93445 84000</a></p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex gap-6">
          <Link href="/privacy" className="text-sm font-black text-[#0A192F]/40 hover:text-[#FBBF24] transition-colors uppercase tracking-widest">Privacy Policy</Link>
          <Link href="/cookies" className="text-sm font-black text-[#0A192F]/40 hover:text-[#FBBF24] transition-colors uppercase tracking-widest">Cookie Policy</Link>
        </div>
      </div>
    </main>
  );
}

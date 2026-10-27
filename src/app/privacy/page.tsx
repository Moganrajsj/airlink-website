import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sri Ram Broadband Services Pvt. Ltd.',
  description: 'Privacy Policy for Sri Ram Broadband Services Pvt. Ltd. and Airlink Broadband.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[#FBBF24] font-black text-xs tracking-[0.3em] uppercase mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0A192F] tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-[#0A192F]/50 text-sm font-medium">Last updated: 27 October 2026 · Sri Ram Broadband Services Pvt. Ltd. | Airlink Broadband</p>
        </div>

        <div className="bg-white rounded-[2rem] border border-[#E5E7EB] p-8 md:p-12 space-y-8 text-[#0A192F]/70 leading-relaxed">
          <p>
            This Privacy Policy explains how Sri Ram Broadband Services Pvt. Ltd. (&ldquo;Sri Ram Broadband,&rdquo; &ldquo;Airlink Broadband,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, stores, and shares personal information when you visit our website, enquire about our broadband services, submit a form on our website or through Facebook/Instagram (including Meta Lead Ads), or contact us by phone, email, or WhatsApp.
          </p>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">1. Information We May Collect</h2>
            <p className="mb-3">Depending on how you contact us or use our services, we may collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Name and mobile number.</li>
              <li>Email address, if you provide one.</li>
              <li>Locality, address, or installation location to check service availability.</li>
              <li>Your enquiry, preferred connection timeline, and details you choose to share about the service you need.</li>
              <li>Customer, installation, service-request, and communication records if you become a customer.</li>
              <li>Basic technical information such as browser, device, or website usage data where our website or tools collect it.</li>
            </ul>
            <p className="mt-3">Please do not submit passwords, payment-card details, or other sensitive information through an enquiry form.</p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We may use your information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Respond to your enquiry and contact you about broadband plans or connection requests.</li>
              <li>Check whether service is available at your location.</li>
              <li>Arrange installation, provide customer support, and manage your account if you subscribe.</li>
              <li>Send service-related updates and information you have requested.</li>
              <li>Improve our website, advertising, and customer service, where applicable.</li>
              <li>Meet legal requirements and protect our business, customers, and systems.</li>
            </ul>
            <p className="mt-3">
              We will not sell your personal information to third parties. We will not use enquiry details for unrelated marketing where consent or another lawful basis is required and has not been obtained.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">3. Automated Checks and AI Assistance</h2>
            <p className="mb-3">
              When you submit an enquiry, our systems automatically check it for obvious errors, repeated submissions and automated abuse. These checks help us reply to genuine enquiries faster and keep junk out of our sales queue. A failed check does not delete your enquiry: anything uncertain is kept and reviewed by a person.
            </p>
            <p className="mb-3">
              We also use a rules-based score and, where available, an AI language model to draft a short internal summary of the enquiry and suggest the next action for our staff. The AI assists our team; it does not decide whether you get service, and it does not contact you on its own.
            </p>
            <p className="mb-3">
              To produce that summary, the details you typed &mdash; such as your name, company, locality, PIN code, service interest, message and the form you used &mdash; may be sent to our AI model provider for processing under its API terms. We do not send your mobile number or email address to the AI provider, and we do not use the AI to make automated decisions that have a legal or similarly significant effect on you.
            </p>
            <p>
              If you would prefer that your enquiry is handled without AI assistance, tell us using the contact details below and our team will review it manually.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">4. Leads from Facebook and Instagram</h2>
            <p className="mb-3">
              If you submit a lead form on Facebook or Instagram, the information you enter may be shared with us by Meta so that we can respond to your enquiry. Meta also processes information under its own privacy terms. Please review Meta&rsquo;s privacy policy on its official website.
            </p>
            <p>
              Submitting a form means you are asking Sri Ram Broadband to contact you about your enquiry. If you do not want further contact, tell us using the contact details below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">5. When We Share Information</h2>
            <p className="mb-3">We may share relevant information only when reasonably needed with:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Our authorised staff and service personnel handling your enquiry or connection.</li>
              <li>Service providers supporting our website, customer management, communications, or lead handling, subject to appropriate safeguards.</li>
              <li>Advertising or technology platforms when needed to receive and manage enquiries or measure campaigns, where those tools are used.</li>
              <li>Government authorities, regulators, or other parties when required by law or necessary to protect legal rights and safety.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">6. Cookies and Website Analytics</h2>
            <p>
              Our website or third-party tools may use cookies or similar technologies to support website functions, understand usage, or measure advertising performance. The technologies actually used may depend on the website configuration. You can manage cookies through your browser settings. If advertising pixels or analytics tools are enabled, their providers may process technical or usage data under their own policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">7. How Long We Keep Information</h2>
            <p className="mb-3">
              We keep personal information only for as long as reasonably necessary to respond to enquiries, provide services, maintain business records, resolve disputes, meet legal obligations, and protect our legitimate interests. Retention periods may vary depending on the type of record and whether you become a customer.
            </p>
            <p>
              Technical abuse signals linked to an enquiry &mdash; such as a hashed IP address and a hashed browser identifier, which cannot be read back as your actual address or device details &mdash; are removed automatically 90 days after the enquiry is received. Security and rate-limit logs are kept for up to 180 days and then deleted. Enquiry records themselves are not deleted automatically; our team reviews them periodically and removes records that are no longer needed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">8. Security</h2>
            <p>
              We take reasonable steps intended to protect personal information from unauthorised access, loss, misuse, or disclosure. However, no website, email, or online transmission can be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">9. Your Choices and Requests</h2>
            <p>
              You may contact us to request access to, correction of, or deletion of personal information you have provided, or to ask us to stop contacting you about marketing. We may need to retain some information where required by law or for legitimate business records. We will review and respond to requests as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">10. Children&rsquo;s Privacy</h2>
            <p>
              Our broadband enquiry services are intended for adults. Please do not submit a child&rsquo;s personal information through our enquiry forms. If you believe a child has provided personal information to us, contact us so we can review the matter.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">11. Third-Party Websites and Services</h2>
            <p>
              Our website or communications may refer to third-party websites or services. Their privacy practices are governed by their own policies, and we are not responsible for their independent practices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The revised version will be posted on this page with an updated &ldquo;Last updated&rdquo; date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-[#0A192F] mb-3">13. Contact Us</h2>
            <p className="mb-3">
              For privacy questions or requests, contact:
            </p>
            <div className="mt-3 bg-[#F7F8FA] rounded-xl p-5 space-y-1 text-sm text-[#0A192F]/80">
              <p className="font-black text-[#0A192F] text-base">Sri Ram Broadband Services Pvt. Ltd.</p>
              <p className="font-semibold text-[#0A192F]/60">Brand: Airlink Broadband</p>
              <p>No. 20J, Nethaji Bye Pass Road,</p>
              <p>Near Ranga Department Store,</p>
              <p>Dharmapuri &ndash; 636701, Tamil Nadu, India.</p>
              <p className="pt-2">Phone:{' '}
                <a href="tel:+919344584000" className="text-[#FBBF24] font-semibold hover:underline">93445 84000</a>
                {' / '}
                <a href="tel:+919345217979" className="text-[#FBBF24] font-semibold hover:underline">93452 17979</a>
              </p>
              <p>Email:{' '}
                <a href="mailto:info@srirambroadband.com" className="text-[#FBBF24] font-semibold hover:underline">info@srirambroadband.com</a>
              </p>
              <p>Website:{' '}
                <a href="https://www.srirambroadband.com" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] font-semibold hover:underline">www.srirambroadband.com</a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 flex gap-6">
          <Link href="/terms" className="text-sm font-black text-[#0A192F]/40 hover:text-[#FBBF24] transition-colors uppercase tracking-widest">Terms of Service</Link>
          <Link href="/cookies" className="text-sm font-black text-[#0A192F]/40 hover:text-[#FBBF24] transition-colors uppercase tracking-widest">Cookie Policy</Link>
        </div>
      </div>
    </main>
  );
}

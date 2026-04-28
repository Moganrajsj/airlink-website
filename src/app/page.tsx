import dynamic from 'next/dynamic';
import Hero from "@/components/sections/Hero";
import { prisma } from "@/lib/prisma";

// Critical components (above the fold)
import AnnouncementBanner from "@/components/banners/AnnouncementBanner";

// Lazy load below-the-fold components
const TrustMarquee = dynamic(() => import("@/components/sections/TrustMarquee"));
const PainSolution = dynamic(() => import("@/components/sections/PainSolution"));
const TrustStats = dynamic(() => import("@/components/sections/TrustStats"));
const Features = dynamic(() => import("@/components/sections/Features"));
const SpeedTest = dynamic(() => import("@/components/sections/SpeedTest"));
const Packages = dynamic(() => import("@/components/sections/Packages"));
const BusinessSolutions = dynamic(() => import("@/components/sections/BusinessSolutions"));
const UrgencyBlock = dynamic(() => import("@/components/sections/UrgencyBlock"));
const ServiceAreas = dynamic(() => import("@/components/sections/ServiceAreas"));
const Coverage = dynamic(() => import("@/components/sections/Coverage"));
const PartnersCarousel = dynamic(() => import("@/components/sections/PartnersCarousel"));
const LocalTestimonials = dynamic(() => import("@/components/sections/LocalTestimonials"));
const CTA = dynamic(() => import("@/components/sections/CTA"));
const PromoBanner = dynamic(() => import("@/components/banners/PromoBanner"));

// New Stitch Banners
const GamingBanner = dynamic(() => import("@/components/sections/GamingBanner"));
const StreamingBanner = dynamic(() => import("@/components/sections/StreamingBanner"));
const SmartHomeBanner = dynamic(() => import("@/components/sections/SmartHomeBanner"));


export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: "Airlink Broadband | Tamil Nadu's #1 Fiber Internet Provider",
  description: "Get lightning-fast fiber internet, enterprise leased lines, and smart home solutions with Airlink Broadband. High-speed connectivity across Dharmapuri, Chennai, and Tamil Nadu.",
  alternates: {
    canonical: "https://www.srirambroadband.com",
  },
};

export default async function Home() {
  const plans = await prisma.plan.findMany({
    where: { status: true, isBusiness: false },
    orderBy: { price: 'asc' }
  });

  const announcementBanners = await prisma.banner.findMany({ where: { bannerType: "announcement", status: true }, orderBy: { createdAt: "desc" } });
  const promoBanners = await prisma.banner.findMany({ where: { bannerType: "promo", status: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col bg-surface overflow-hidden">
      {/* Announcement Banner */}
      {announcementBanners.length > 0 && (
        <AnnouncementBanner banner={announcementBanners[0]} />
      )}

      {/* 1. Hero — Emotional hook, trust badges, 3 CTAs */}
      <Hero />

      {/* New Streaming Banner - Lifestyle Proof */}
      <StreamingBanner />

      {/* Promo Banner directly below the Hero area */}
      {promoBanners.length > 0 && <PromoBanner banners={promoBanners} />}

      {/* 1.5 Trust Strip — Scrolling badges */}
      <TrustMarquee />

      {/* New Gaming Banner - Performance Hook */}
      <GamingBanner />

      {/* 2. Pain→Solution — Conversion psychology: identify problem, offer solution */}
      <PainSolution />

      {/* 3. Trust Stats — Social proof with animated counters */}
      <TrustStats />

      {/* New Smart Home Banner - Connectivity Proof */}
      <SmartHomeBanner />

      {/* 4. Features — Why Choose Us / infrastructure credentials */}
      <Features />
      {/* 5. Speed Test — Interactive proof of performance */}
      <SpeedTest />
      {/* 6. Packages — Plans with pricing */}
      <Packages plans={plans} />
      {/* 7. Business Solutions — SME Tamil Nadu targeting */}
      <BusinessSolutions />

      {/* 9. Urgency Block — Free install, per-day pricing */}
      <UrgencyBlock />
      {/* 10. Service Areas — Local trust, Tamil Nadu cities */}
      <ServiceAreas />
      {/* 11. Coverage checker */}
      <Coverage />
      {/* 12. Partners Carousel */}
      <PartnersCarousel />
      {/* 13. Testimonials — Tamil Nadu localized reviews */}
      <LocalTestimonials />
      {/* 14. Final CTA */}
      <CTA />
    </div>
  );
}

import Hero from "@/components/sections/Hero";
import TrustMarquee from "@/components/sections/TrustMarquee";
import PainSolution from "@/components/sections/PainSolution";
import TrustStats from "@/components/sections/TrustStats";
import Features from "@/components/sections/Features";
import SpeedTest from "@/components/sections/SpeedTest";
import Packages from "@/components/sections/Packages";
import BusinessSolutions from "@/components/sections/BusinessSolutions";
import UrgencyBlock from "@/components/sections/UrgencyBlock";
import ServiceAreas from "@/components/sections/ServiceAreas";
import Coverage from "@/components/sections/Coverage";
import PartnersCarousel from "@/components/sections/PartnersCarousel";
import LocalTestimonials from "@/components/sections/LocalTestimonials";
import CTA from "@/components/sections/CTA";
import AnnouncementBanner from "@/components/banners/AnnouncementBanner";
import PromoBanner from "@/components/banners/PromoBanner";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const plans = await prisma.plan.findMany({
    where: { status: true, isBusiness: false },
    take: 3
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

      {/* Promo Banner directly below the Hero component */}
      {promoBanners.length > 0 && <PromoBanner banners={promoBanners} />}

      {/* 1.5 Trust Strip — Scrolling badges */}
      <TrustMarquee />
      {/* 2. Pain→Solution — Conversion psychology: identify problem, offer solution */}
      <PainSolution />

      {/* 3. Trust Stats — Social proof with animated counters */}
      <TrustStats />
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

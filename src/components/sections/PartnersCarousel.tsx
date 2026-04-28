"use client";
import React, { useState } from 'react';

// Using direct reliable SVG/PNG urls to avoid ad-blocker or clearbit issues
const partners = [
    { name: "HPE Aruba", logo: "/images/partners/HPE aruba networking.png" },
    { name: "Ubiquiti", logo: "/images/partners/u.png" },
    { name: "Cisco", logo: "/images/partners/cisco.png" },
    { name: "Equinix", logo: "/images/partners/equinix.png" },
    { name: "ST Telemedia", logo: "/images/partners/st telemedia global data centres.png" },
    { name: "Broadcom", logo: "/images/partners/broadcom.png" },
    { name: "Zscaler", logo: "/images/partners/zsaler.png" },
    { name: "Microsoft 365", logo: "/images/partners/microsoft 365.png" },
    { name: "Google Workspace", logo: "/images/partners/google workspace.png" },
    { name: "Observium", logo: "/images/partners/observium.png" },
    { name: "Cloudstack", logo: "/images/partners/cloudstack.png" },
    { name: "Dell", logo: "/images/partners/DELL technologies.png" },
    { name: "HPE", logo: "/images/partners/HPE.png" },
    { name: "D-Link", logo: "/images/partners/d link .png" },
    { name: "Fortinet", logo: "/images/partners/fortinet.png" },
    { name: "SonicWall", logo: "/images/partners/Sonicwall.png" },
    { name: "Cloud Cube", logo: "/images/partners/cloud cube .png" }
];

const LogoCard = ({ partner }: { partner: { name: string, logo: string } }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="flex items-center justify-center min-w-[200px] h-24 mx-4 bg-white rounded-2xl border border-gray-100 grayscale hover:grayscale-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group p-6">
            {!imgError ? (
                <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    onError={() => setImgError(true)}
                    loading="lazy"
                />
            ) : (
                <span className="font-extrabold text-xl text-gray-400 group-hover:text-secondary transition-all text-center leading-tight">
                    {partner.name}
                </span>
            )}
        </div>
    );
};

const PartnersCarousel = () => {
    return (
        <section className="py-24 bg-surface border-y border-gray-100 overflow-hidden" id="partners">
            <div className="container mx-auto px-6 mb-16 text-center">
                <h2 className="text-sm font-black tracking-[0.3em] text-gray-400 uppercase mb-4">
                    Trusted Technology Partners
                </h2>
                <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full"></div>
            </div>

            <div className="relative flex w-full">
                {/* Gradient Masks for smooth fading edges */}
                <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none"></div>

                <div className="flex animate-[shimmer_40s_linear_infinite] w-max select-none hover:[animation-play-state:paused]">
                    {/* Doubled for infinite scroll effect */}
                    {[...partners, ...partners].map((partner, i) => (
                        <LogoCard key={i} partner={partner} />
                    ))}
                </div>
            </div>

            <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </section>
    );
};

export default PartnersCarousel;

"use client";
import React, { useState } from 'react';

// Using direct reliable SVG/PNG urls to avoid ad-blocker or clearbit issues
const partners = [
    { name: "HPE Aruba", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/HPE_Aruba_Networking_logo.svg" },
    { name: "Ubiquiti", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Ubiquiti_Networks_logo.svg" },
    { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
    { name: "Equinix", logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Equinix_logo.svg" },
    { name: "ST Telemedia", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/ST_Telemedia_logo.svg/512px-ST_Telemedia_logo.svg.png" },
    { name: "Broadcom", logo: "https://upload.wikimedia.org/wikipedia/commons/0/03/Broadcom_Logo.svg" },
    { name: "Zscaler", logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Zscaler_logo.svg" },
    { name: "Cloudflare", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg" },
    { name: "Microsoft 365", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Google Workspace", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Workspace_Logo.svg" },
    { name: "Dell Technologies", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg" },
    { name: "HPE", logo: "https://upload.wikimedia.org/wikipedia/commons/4/46/Hewlett_Packard_Enterprise_logo.svg" },
    { name: "Extreme Networks", logo: "https://upload.wikimedia.org/wikipedia/commons/d/df/Extreme_Networks_logo.svg" },
    { name: "D-Link", logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/D-Link_logo.svg" },
    { name: "Fortinet", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Fortinet_logo.svg" },
    { name: "SonicWall", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/SonicWall_Logo.svg" },
    { name: "Cloud Cube", logo: "https://cdn-icons-png.flaticon.com/512/9338/9338006.png" }
];

const LogoCard = ({ partner }: { partner: { name: string, logo: string } }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="cursor-target flex items-center justify-center min-w-[200px] h-24 mx-4 bg-white rounded-2xl border border-gray-100 grayscale hover:grayscale-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group p-6">
            {!imgError ? (
                <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    onError={() => setImgError(true)}
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

"use client";

import React, { useState } from 'react';

interface OTTIconProps {
    name: string;
    className?: string;
}

const OTTIcon: React.FC<OTTIconProps> = ({ name, className = "w-10 h-10" }) => {
    const brand = name.toLowerCase();
    const [imageError, setImageError] = useState(false);

    // Reliable public CDN URLs for actual OTT logos
    const logoUrls: Record<string, string> = {
        'amazon prime': '/images/ott-logos/Amazon Prime logo.png',
        'sun nxt': '/images/ott-logos/sun nxt logo.jpg',
        'zee5': '/images/ott-logos/Zee5 logo.png',
        'sony liv': '/images/ott-logos/Sony Liv logo.jpg',
        'aha': '/images/ott-logos/aha logo.jpg',
        'jio hotstar': '/images/ott-logos/jio hotstar logo.png',
        'fancode': '/images/ott-logos/Fancode logo.png',
        'distro tv': '/images/ott-logos/Distro TV logo.jpg',
        'om tv': '/images/ott-logos/OM_TV logo.webp',
        'dollywood play': '/images/ott-logos/Dollywood-Play-logo.png',
        'playflix': '/images/ott-logos/PlayFlix logo.png',
        'hubhopper': '/images/ott-logos/Hubhopper logo.png',
        'friday': '/images/ott-logos/fiday logo.webp',
        'fridaay': '/images/ott-logos/fiday logo.webp',
        'sun next': '/images/ott-logos/sun nxt logo.jpg',
        'sonyliv': '/images/ott-logos/Sony Liv logo.jpg'
    };

    const url = logoUrls[brand];

    // Premium Fallback generation
    const getColors = (name: string) => {
        const colors: Record<string, string> = {
            "Amazon Prime": "bg-[#00A8E1] text-white",
            "Sun NXT": "bg-[#F39200] text-white",
            "Zee5": "bg-[#8230C6] text-white",
            "Sony Liv": "bg-[#000000] text-[#FFD700] border border-[#FFD700]/30",
            "Aha": "bg-[#FF4500] text-white",
            "OM TV": "bg-[#D32F2F] text-white",
            "Dollywood Play": "bg-[#1976D2] text-white",
            "Jio Hotstar": "bg-[#1B1464] text-white",
            "Fancode": "bg-[#FF0000] text-white",
            "PlayFlix": "bg-[#00ACC1] text-white",
            "Distro TV": "bg-[#4CAF50] text-white",
            "Hubhopper": "bg-[#FF007F] text-white",
            "Friday": "bg-[#E91E63] text-white",
            "Fridaay": "bg-[#E91E63] text-white",
            "Sun Next": "bg-[#F39200] text-white",
            "SonyLIV": "bg-[#000000] text-[#FFD700] border border-[#FFD700]/30",
        };
        return colors[name] || "bg-gray-800 text-white";
    };

    const getShortName = (name: string) => {
        if (name === "Amazon Prime") return "Prime";
        if (name === "Sun NXT") return "Sun";
        if (name === "Sony Liv") return "Liv";
        if (name === "Jio Hotstar") return "Jio";
        return name.split(" ")[0].substring(0, 4);
    };

    if (url && !imageError) {
        return (
            <div className={`cursor-target flex items-center justify-center rounded-xl p-1 bg-white border border-gray-100 shadow-sm overflow-hidden ${className}`} title={name}>
                <img
                    src={url}
                    alt={name}
                    className="w-full h-full object-contain"
                    onError={() => setImageError(true)}
                />
            </div>
        );
    }

    return (
        <div className={`cursor-target flex items-center justify-center rounded-xl p-2 shadow-sm text-center ${getColors(name)} ${className}`} title={name}>
            <span className="font-black text-[9px] uppercase tracking-wider leading-tight w-full break-words">{getShortName(name)}</span>
        </div>
    );
};

export default OTTIcon;

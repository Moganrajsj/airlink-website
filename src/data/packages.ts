export interface Package {
    id: string;
    speed: string;
    price: number;
    support: string;
    ottApps?: string[];
    bestFor: string;
    benefits: string[];
    positioningLine: string;
    isPopular?: boolean;
    isPremium?: boolean;
    bgImage?: string;
}

export const packages: Package[] = [
    {
        id: "pkg-40",
        speed: "40",
        price: 499,
        support: "24/7 Online Support",
        bestFor: "Light Users & Small Families",
        benefits: ["Perfect for browsing & YouTube", "Online classes", "Social media", "1–2 devices connected", "Budget friendly"],
        positioningLine: "Affordable Fiber for Everyday Internet Needs.",
        bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "pkg-50",
        speed: "50",
        price: 599,
        support: "24/7 Online Support",
        ottApps: ["Sun NXT", "Sony Liv", "OM TV", "Dollywood Play", "Friday"],
        bestFor: "Entertainment + Small Families",
        benefits: ["Smooth HD streaming", "OTT movie lovers", "Smart TV users", "2–3 users simultaneously", "Work from home basic tasks"],
        positioningLine: "Affordable Fiber + OTT Entertainment Pack.",
        bgImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "pkg-100",
        speed: "100",
        price: 799,
        support: "24/7 Online Support",
        ottApps: ["Sun Next", "Zee5", "SonyLIV", "Aha", "Dollywood Play", "Fridaay", "Om TV"],
        bestFor: "Families + Work From Home",
        benefits: ["Buffer-free 4K streaming", "Smooth Zoom / Teams calls", "Online gaming (casual)", "3–4 users simultaneously"],
        positioningLine: "Balanced Speed & Premium Streaming Experience.",
        bgImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "pkg-200",
        speed: "200",
        price: 899,
        support: "24/7 Online Support",
        ottApps: ["Jio Hotstar", "Sun NXT", "Zee5", "Sony Liv", "OM TV", "Dollywood Play", "Aha"],
        bestFor: "Heavy Streaming + Gamers",
        benefits: ["IPL & Live Sports Streaming", "Lag-free gaming", "4K multi-device streaming", "4–6 users simultaneously", "Faster downloads"],
        positioningLine: "Power Packed Fiber for Sports & Entertainment Lovers.",
        isPopular: true,
        bgImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "pkg-300",
        speed: "300",
        price: 999,
        support: "24/7 Online Support",
        ottApps: ["Jio Hotstar", "Sun NXT", "Zee5", "Sony Liv", "OM TV", "PlayFlix", "Dollywood Play", "Aha"],
        bestFor: "Large Families + Gamers",
        benefits: ["Ultra-smooth 4K streaming", "Competitive gaming ready", "Large family support", "Work + Entertainment together", "Quick large file downloads"],
        positioningLine: "Ultra-Speed Fiber with Maximum Entertainment.",
        bgImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "pkg-500",
        speed: "500",
        price: 1299,
        support: "24/7 Priority Support",
        ottApps: ["Amazon Prime", "Sun NXT", "Zee5", "Sony Liv", "Aha", "OM TV", "Dollywood Play", "Fancode", "Distro TV", "PlayFlix", "Hubhopper", "Jio Hotstar"],
        bestFor: "Premium Homes + Power Users",
        benefits: ["Zero buffering 4K & 8K streaming", "Professional gaming", "Heavy downloads", "Smart home ready", "8–10 devices simultaneously", "Ultimate entertainment bundle"],
        positioningLine: "The Ultimate Fiber Experience.",
        isPremium: true,
        bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    }
];

export interface Banner {
    id: string;
    title: string;
    subtitle: string | null;
    offerHighlight: string | null;
    imageUrl: string | null;
    ctaText: string | null;
    ctaLink: string | null;
    bannerType: string;
    status: boolean;
    createdAt: Date;
}

export const staticAnnouncementBanners: Banner[] = [
    {
        id: "ann-1",
        title: "Flash Sale: Zero Installation Cost on All Premium Fiber Plans!",
        subtitle: "Valid for limited time only",
        offerHighlight: "Free Installation",
        imageUrl: null,
        ctaText: "Check Plans",
        ctaLink: "/plans",
        bannerType: "announcement",
        status: true,
        createdAt: new Date("2026-05-16T00:00:00Z")
    }
];

export const staticPromoBanners: Banner[] = [
    {
        id: "promo-1",
        title: "IPL Season Special",
        subtitle: "Get Disney+ Hotstar included with 200 Mbps & above plans",
        offerHighlight: "Hotstar Included",
        imageUrl: "https://images.unsplash.com/photo-1540747913346-19e3adca174f?auto=format&fit=crop&q=80&w=1200",
        ctaText: "Book Now",
        ctaLink: "/contact",
        bannerType: "promo",
        status: true,
        createdAt: new Date("2026-05-16T00:00:00Z")
    }
];

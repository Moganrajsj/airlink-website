const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Seeding Comprehensive Site Content ---');

    // 1. Seed Plans (Full set)
    console.log('Seeding Plans...');
    await prisma.plan.deleteMany({});
    const plans = [
        {
            title: '40 Mbps', speed: 40, price: 499, tag: null, isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: [],
                bestFor: 'Light Users & Small Families',
                benefits: ['Perfect for browsing & YouTube', 'Online classes', 'Social media', '1-2 devices connected', 'Budget friendly'],
                positioningLine: 'Affordable Fiber for Everyday Internet Needs.',
                support: '24/7 Online Support', isPopular: false, isPremium: false
            })
        },
        {
            title: '50 Mbps', speed: 50, price: 599, tag: null, isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Sun NXT', 'Sony Liv', 'OM TV', 'Dollywood Play', 'Friday'],
                bestFor: 'Entertainment + Small Families',
                benefits: ['Smooth HD streaming', 'OTT movie lovers', 'Smart TV users', '2-3 users simultaneously', 'Work from home basic tasks'],
                positioningLine: 'Affordable Fiber + OTT Entertainment Pack.',
                support: '24/7 Online Support', isPopular: false, isPremium: false
            })
        },
        {
            title: '100 Mbps', speed: 100, price: 799, tag: null, isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Sun Next', 'Zee5', 'SonyLIV', 'Aha', 'Dollywood Play', 'Fridaay', 'Om TV'],
                bestFor: 'Families + Work From Home',
                benefits: ['Buffer-free 4K streaming', 'Smooth Zoom / Teams calls', 'Online gaming (casual)', '3-4 users simultaneously'],
                positioningLine: 'Balanced Speed & Premium Streaming Experience.',
                support: '24/7 Online Support', isPopular: false, isPremium: false
            })
        },
        {
            title: '200 Mbps', speed: 200, price: 899, tag: 'Most Popular', isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Jio Hotstar', 'Sun NXT', 'Zee5', 'Sony Liv', 'OM TV', 'Dollywood Play', 'Aha'],
                bestFor: 'Heavy Streaming + Gamers',
                benefits: ['IPL & Live Sports Streaming', 'Lag-free gaming', '4K multi-device streaming', '4-6 users simultaneously', 'Faster downloads'],
                positioningLine: 'Power Packed Fiber for Sports & Entertainment Lovers.',
                support: '24/7 Online Support', isPopular: true, isPremium: false
            })
        },
        {
            title: '300 Mbps', speed: 300, price: 999, tag: null, isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Jio Hotstar', 'Sun NXT', 'Zee5', 'Sony Liv', 'OM TV', 'PlayFlix', 'Dollywood Play', 'Aha'],
                bestFor: 'Large Families + Gamers',
                benefits: ['Ultra-smooth 4K streaming', 'Competitive gaming ready', 'Large family support', 'Work + Entertainment together', 'Quick large file downloads'],
                positioningLine: 'Ultra-Speed Fiber with Maximum Entertainment.',
                support: '24/7 Online Support', isPopular: false, isPremium: false
            })
        },
        {
            title: '500 Mbps', speed: 500, price: 1299, tag: 'Premium', isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Amazon Prime', 'Sun NXT', 'Zee5', 'Sony Liv', 'Aha', 'OM TV', 'Dollywood Play', 'Fancode', 'Distro TV', 'PlayFlix', 'Hubhopper', 'Jio Hotstar'],
                bestFor: 'Premium Homes + Power Users',
                benefits: ['Zero buffering 4K & 8K streaming', 'Professional gaming', 'Heavy downloads', 'Smart home ready', '8-10 devices simultaneously', 'Ultimate entertainment bundle'],
                positioningLine: 'The Ultimate Fiber Experience.',
                support: '24/7 Priority Support', isPopular: false, isPremium: true
            })
        },
    ];
    for (const plan of plans) {
        await prisma.plan.create({ data: plan });
    }
    console.log(`Seeded ${plans.length} plans.`);

    // 2. Seed Banners
    console.log('Seeding Banners...');
    await prisma.banner.deleteMany({});
    const banners = [
        {
            title: 'Experience Blazing Fast Fiber',
            subtitle: 'Starting from just ₹499/month with unlimited data. High-speed broadband across Tamil Nadu.',
            offerHighlight: 'Get 1 Month Free on Yearly Plans',
            imageUrl: '/images/plans_hero_background.png',
            bannerType: 'hero',
            ctaText: 'View Plans',
            ctaLink: '#plans',
            status: true
        },
        {
            title: 'Unlimited Entertainment v2',
            subtitle: 'Stream your favorite shows and movies with high-speed fiber quality.',
            offerHighlight: 'OTT Included in Premium Plans',
            imageUrl: '/images/banners/unlimited-entertainment-v2.png',
            bannerType: 'promo',
            ctaText: 'Explore Plans',
            ctaLink: '#plans',
            status: true
        },
        {
            title: 'Enterprise Leased Lines',
            subtitle: 'Secure, reliable and high-speed connectivity for your business infrastructure.',
            offerHighlight: '99.9% Uptime Guarantee',
            imageUrl: '/images/broadband_ad_hero.png',
            bannerType: 'promo',
            ctaText: 'Enquire Now',
            ctaLink: '#contact',
            status: true
        },
        {
            title: 'Premium Dual-Band WiFi',
            subtitle: 'Experience seamless coverage across your entire home with our latest WiFi 6 gear.',
            offerHighlight: 'Optimized for Gaming & 4K',
            imageUrl: '/images/offers/premium_wifi_bg.png',
            bannerType: 'promo',
            ctaText: 'Learn More',
            ctaLink: '#features',
            status: true
        }
    ];
    for (const banner of banners) {
        await prisma.banner.create({ data: banner });
    }
    console.log(`Seeded ${banners.length} banners.`);

    // 3. Seed Coverage
    console.log('Seeding Coverage Areas...');
    await prisma.coverage.deleteMany({});
    const coverage = [
        { cityName: 'Dharmapuri', status: 'Live', leadsCount: 150 },
        { cityName: 'Chennai', status: 'Live', leadsCount: 450 },
        { cityName: 'Salem', status: 'Coming Soon', leadsCount: 85 },
        { cityName: 'Hosur', status: 'Live', leadsCount: 120 }
    ];
    for (const area of coverage) {
        await prisma.coverage.create({ data: area });
    }
    console.log(`Seeded ${coverage.length} coverage areas.`);

    // 4. Seed Testimonials
    console.log('Seeding Testimonials...');
    await prisma.testimonial.deleteMany({});
    const testimonials = [
        { name: "Rajesh Kumar", role: "Professional Gamer", content: "Switched to Airlink for the low latency. My ping in Valorant dropped from 40ms to 9ms. Absolutely stable and perfect for gaming.", rating: 5 },
        { name: "Sneha Reddy", role: "Freelance Designer", content: "The symmetrical speeds are a lifesaver. Uploading heavy design files to the cloud is now faster than ever. No more waiting!", rating: 5 },
        { name: "Vikram Singh", role: "Business Owner", content: "Reliable internet is crucial for my office. Airlink's uptime has been incredible, and their support team is always helpful.", rating: 5 },
        { name: "Priya Sharma", role: "Software Engineer", content: "Working from home requires a rock-solid connection. Airlink delivers consistent speeds day and night without any packet loss.", rating: 5 }
    ];
    for (const t of testimonials) {
        await prisma.testimonial.create({ data: { ...t, isActive: true } });
    }
    console.log(`Seeded ${testimonials.length} testimonials.`);

    console.log('--- Seeding Completed ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

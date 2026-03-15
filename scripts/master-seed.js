const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('--- MASTER PRODUCTION SEED ---');

    // 1. CLEAR TABLES
    console.log('Clearing Plans, Banners, and Admins...');
    await prisma.plan.deleteMany({});
    await prisma.banner.deleteMany({});
    await prisma.admin.deleteMany({});

    // 2. SEED PLANS
    const plans = [
        {
            title: '40 Mbps', speed: 40, price: 499, tag: null, isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: [],
                bestFor: 'Light Users',
                benefits: ['Unlimited Data', 'Perfect for browsing', 'Social media'],
                positioningLine: 'Affordable Fiber for Everyday Internet Needs.',
                support: '24/7 Online Support', isPopular: false, isPremium: false
            })
        },
        {
            title: '50 Mbps', speed: 50, price: 599, tag: null, isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Sun NXT', 'Sony Liv', 'OM TV', 'Dollywood Play', 'Friday'],
                bestFor: 'Entertainment',
                benefits: ['HD Streaming', 'OTT Bundle', '3 Users'],
                positioningLine: 'Affordable Fiber + OTT Entertainment Pack.',
                support: '24/7 Online Support', isPopular: false, isPremium: false
            })
        },
        {
            title: '100 Mbps', speed: 100, price: 799, tag: null, isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Sun NXT', 'Zee5', 'Sony Liv', 'Aha', 'Dollywood Play', 'Friday', 'OM TV'],
                bestFor: 'Families',
                benefits: ['4K Streaming', 'Zoom Ready', 'Multiple Users'],
                positioningLine: 'Balanced Speed & Premium Streaming Experience.',
                support: '24/7 Online Support', isPopular: false, isPremium: false
            })
        },
        {
            title: '200 Mbps', speed: 200, price: 899, tag: 'Most Popular', isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Jio Hotstar', 'Sun NXT', 'Zee5', 'Sony Liv', 'OM TV', 'Dollywood Play', 'Aha'],
                bestFor: 'Heavy Users',
                benefits: ['Live Sports', 'Gaming', 'Fast Downloads'],
                positioningLine: 'Power Packed Fiber for Sports & Entertainment Lovers.',
                support: '24/7 Online Support', isPopular: true, isPremium: false
            })
        },
        {
            title: '300 Mbps', speed: 300, price: 999, tag: null, isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Jio Hotstar', 'Sun NXT', 'Zee5', 'Sony Liv', 'OM TV', 'PlayFlix', 'Dollywood Play', 'Aha'],
                bestFor: 'Power Gamers',
                benefits: ['Zero Lag', 'Large Downloads', '8 OTTs'],
                positioningLine: 'Ultra-Speed Fiber with Maximum Entertainment.',
                support: '24/7 Online Support', isPopular: false, isPremium: false
            })
        },
        {
            title: '500 Mbps', speed: 500, price: 1299, tag: 'Premium', isBusiness: false, status: true,
            features: JSON.stringify({
                ottApps: ['Amazon Prime', 'Sun NXT', 'Zee5', 'Sony Liv', 'Aha', 'OM TV', 'Dollywood Play', 'Fancode', 'Distro TV', 'PlayFlix', 'Hubhopper', 'Jio Hotstar'],
                bestFor: 'Ultra Homes',
                benefits: ['8K Streaming', 'Ultimate Bundle', 'Priority Support'],
                positioningLine: 'The Ultimate Fiber Experience.',
                support: '24/7 Priority Support', isPopular: false, isPremium: true
            })
        }
    ];

    for (const p of plans) await prisma.plan.create({ data: p });
    console.log(`Seeded ${plans.length} plans.`);

    // 3. SEED BANNERS
    const banners = [
        {
            title: 'Experience Blazing Fast Fiber',
            subtitle: 'Starting from just ₹499/month with unlimited data.',
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
    for (const b of banners) await prisma.banner.create({ data: b });
    console.log(`Seeded ${banners.length} banners.`);

    // 4. SEED ADMIN
    const hashedPassword = await bcrypt.hash('StrongAdminPassword123', 10);
    await prisma.admin.create({
        data: {
            name: 'System Admin',
            email: 'admin@srirambroadband.com',
            password: hashedPassword,
            role: 'admin'
        }
    });
    console.log('Admin user created.');

    console.log('--- MASTER SEED COMPLETE ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());

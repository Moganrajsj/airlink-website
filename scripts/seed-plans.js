const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

async function main() {
    console.log('Clearing all existing plans...');
    await prisma.plan.deleteMany({});
    console.log('Seeding all 6 plans with OTT apps...');
    for (const plan of plans) {
        await prisma.plan.create({ data: plan });
        const f = JSON.parse(plan.features);
        console.log('Created:', plan.title, plan.price, '| OTTs:', f.ottApps.join(', ') || 'none');
    }
    console.log('Done! All 6 plans seeded.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

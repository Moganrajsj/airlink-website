const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Updating Site Content with 4 Promo Banners ---');

    // 2. Seed Banners
    console.log('Clearing and Seeding Banners...');
    await prisma.banner.deleteMany({});
    const banners = [
        {
            title: 'Unlimited Entertainment v2',
            subtitle: 'Stream your favorite shows and movies with high-speed fiber.',
            offerHighlight: 'OTT Included in Premium Plans',
            imageUrl: '/images/banners/unlimited-entertainment-v2.webp',
            bannerType: 'promo',
            ctaText: 'Explore Plans',
            ctaLink: '#plans',
            status: true
        },
        {
            title: 'Enterprise Leased Lines',
            subtitle: 'Secure, reliable and high-speed connectivity for your business.',
            offerHighlight: '99.9% Uptime Guarantee',
            imageUrl: '/images/infrastructure.webp', // Fallback or better if found
            bannerType: 'promo',
            ctaText: 'Enquire Now',
            ctaLink: '#contact',
            status: true
        },
        {
            title: 'Free Installation Offer',
            subtitle: 'Get connected with zero installation charges on select fiber plans.',
            offerHighlight: 'Limited Time Offer',
            imageUrl: '/images/offers/free_installation_bg.webp',
            bannerType: 'promo',
            ctaText: 'Get Started',
            ctaLink: '#contact',
            status: true
        },
        {
            title: 'Premium Dual-Band WiFi',
            subtitle: 'Experience seamless coverage across your entire home with our latest gear.',
            offerHighlight: 'Optimized for Gaming & 4K',
            imageUrl: '/images/offers/premium_wifi_bg.webp',
            bannerType: 'promo',
            ctaText: 'Learn More',
            ctaLink: '#features',
            status: true
        }
    ];

    // Add back the hero banner too
    const heroBanner = {
        title: 'Experience Blazing Fast Fiber',
        subtitle: 'Starting from just ₹499/month with unlimited data.',
        offerHighlight: 'Get 1 Month Free on Yearly Plans',
        bannerType: 'hero',
        ctaText: 'View Plans',
        ctaLink: '#plans',
        status: true
    };

    const allBanners = [heroBanner, ...banners];

    for (const banner of allBanners) {
        await prisma.banner.create({ data: banner });
    }
    console.log(`Seeded ${allBanners.length} banners.`);

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

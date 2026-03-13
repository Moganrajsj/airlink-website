const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Content Check ---');
    
    const plansCount = await prisma.plan.count();
    console.log(`Plans: ${plansCount}`);
    
    const bannersCount = await prisma.banner.count();
    console.log(`Banners: ${bannersCount}`);
    
    const assetsCount = await prisma.backgroundAsset.count();
    console.log(`BackgroundAssets: ${assetsCount}`);
    
    if (plansCount > 0) {
        const plans = await prisma.plan.findMany();
        console.log('Sample Plan:', plans[0]);
    }
    
    if (bannersCount > 0) {
        const banners = await prisma.banner.findMany();
        console.log('Sample Banner:', banners[0]);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

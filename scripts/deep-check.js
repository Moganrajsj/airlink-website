const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- PRODUCTION DATABASE AUDIT ---');
    
    const plansCount = await prisma.plan.count();
    const bannersCount = await prisma.banner.count();
    const adminCount = await prisma.admin.count();
    const coverageCount = await prisma.coverage.count();
    const testimonialsCount = await prisma.testimonial.count();

    console.log('Counts:');
    console.log(`- Plans: ${plansCount}`);
    console.log(`- Banners: ${bannersCount}`);
    console.log(`- Admins: ${adminCount}`);
    console.log(`- Coverage: ${coverageCount}`);
    console.log(`- Testimonials: ${testimonialsCount}`);

    if (plansCount > 0) {
        const plans = await prisma.plan.findMany();
        console.log('\nPlans Summary:');
        plans.forEach(p => {
            let f = {};
            try { f = JSON.parse(p.features); } catch(e) {}
            console.log(`[${p.speed} Mbps] tag: ${p.tag} | isPopular (JSON): ${f.isPopular} | ottCount: ${f.ottApps?.length || 0}`);
        });
    }

    if (adminCount > 0) {
        const admins = await prisma.admin.findMany();
        console.log('\nAdmins:');
        admins.forEach(a => console.log(`- ${a.name} (${a.email})`));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());

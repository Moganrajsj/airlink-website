const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const plans = await prisma.plan.findMany({
        where: {
            price: { in: [499, 599, 799, 899, 999, 1299] }
        }
    });
    console.log('--- TARGET PLANS IN DB ---');
    plans.forEach(p => {
        console.log(`[${p.id}] ${p.title} (${p.speed} Mbps) - Price: ${p.price} - Status: ${p.status} - Business: ${p.isBusiness}`);
        console.log('  Features Raw:', p.features);
        try {
            const f = JSON.parse(p.features);
            console.log('  Benefits List:', f.benefits);
            console.log('  OTT List:', f.ottApps);
        } catch (e) {
            console.log('  JSON Parse Error:', e.message);
        }
        console.log('-------------------');
    });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

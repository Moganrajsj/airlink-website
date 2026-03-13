const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reproduce() {
    console.log("--- REPRODUCTION START ---");
    
    // 1. Create a test plan
    const testPlan = await prisma.plan.create({
        data: {
            title: "Repro Test Plan",
            speed: 100,
            price: 499,
            features: "{}",
            isBusiness: false,
            status: true
        }
    });
    console.log(`Created plan with price: ${testPlan.price}`);
    
    // 2. Update to 500
    await prisma.plan.update({
        where: { id: testPlan.id },
        data: { price: 500 }
    });
    
    const updatedPlan = await prisma.plan.findUnique({ where: { id: testPlan.id } });
    console.log(`Updated plan (500) price in DB: ${updatedPlan.price}`);
    
    // 3. Update to 498
    await prisma.plan.update({
        where: { id: testPlan.id },
        data: { price: 498 }
    });
    
    const updatedPlan2 = await prisma.plan.findUnique({ where: { id: testPlan.id } });
    console.log(`Updated plan (498) price in DB: ${updatedPlan2.price}`);
    
    // 4. Cleanup
    await prisma.plan.delete({ where: { id: testPlan.id } });
    console.log("--- REPRODUCTION END ---");
}

reproduce();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    const plans = await prisma.plan.findMany();
    if (plans.length === 0) {
        console.log("No plans found");
        return;
    }
    const plan = plans[0];
    const oldPrice = plan.price;
    const newPriceValue = 500;
    
    console.log(`Updating plan ${plan.id} from ${oldPrice} to ${newPriceValue}`);
    
    await prisma.plan.update({
        where: { id: plan.id },
        data: { price: newPriceValue }
    });
    
    const updatedPlan = await prisma.plan.findUnique({ where: { id: plan.id } });
    console.log(`NEW_PRICE_CHECK: ${updatedPlan.price}`);
    
    // Cleanup
    await prisma.plan.update({
        where: { id: plan.id },
        data: { price: oldPrice }
    });
}

test();

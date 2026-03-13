const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function update() {
    const plans = await prisma.plan.findMany();
    if (plans.length === 0) return;
    const plan = plans[0];
    await prisma.plan.update({
        where: { id: plan.id },
        data: { price: 500 }
    });
    console.log(`Plan ${plan.id} updated to 500`);
}

update();

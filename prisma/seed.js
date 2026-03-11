const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('test123', 10);

    // Create Admin
    await prisma.user.upsert({
        where: { email: 'admin@airlink.com' },
        update: {},
        create: {
            email: 'admin@airlink.com',
            name: 'Airlink Admin',
            password: adminPassword,
            role: 'admin',
            isPaid: true,
        },
    });

    // Create Test Customer
    await prisma.user.upsert({
        where: { email: 'customer@test.com' },
        update: {},
        create: {
            email: 'customer@test.com',
            name: 'Test Customer',
            password: customerPassword,
            role: 'customer',
            plan: 'Giga Fiber',
            isPaid: true,
            billingDate: new Date(),
        },
    });

    console.log('Seed completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

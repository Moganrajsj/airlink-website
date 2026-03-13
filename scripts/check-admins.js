const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Admin Data ---');
    try {
        const admins = await prisma.admin.findMany();
        console.log(`Found ${admins.length} admins.`);
        admins.forEach(admin => {
            console.log(`- ID: ${admin.id}, Email: ${admin.email}`);
        });
    } catch (error) {
        console.error('Error checking admins:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

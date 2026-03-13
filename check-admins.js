const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Admin Users ---');
    const admins = await prisma.admin.findMany();
    admins.forEach(admin => {
        console.log(`ID: ${admin.id}`);
        console.log(`Name: ${admin.name}`);
        console.log(`Email: "${admin.email}"`);
        console.log(`Password: "${admin.password}"`);
        console.log('---');
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

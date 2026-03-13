const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Re-seeding Admin User ---');
    const email = 'admin@srirambroadband.com';
    const password = 'admin123';
    
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Upsert admin
        const admin = await prisma.admin.upsert({
            where: { email: email.toLowerCase() },
            update: {
                password: hashedPassword,
                name: 'System Admin',
                role: 'ADMIN'
            },
            create: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name: 'System Admin',
                role: 'ADMIN'
            }
        });
        
        console.log(`Success! Admin updated/created: ${admin.email}`);
        console.log(`Password reset to: ${password}`);
    } catch (error) {
        console.error('Error re-seeding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

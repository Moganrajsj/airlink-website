const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@srirambroadband.com';
    const password = 'StrongAdminPassword123';
    
    console.log('--- Creating Admin User ---');
    
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
        where: { email }
    });
    
    if (existingAdmin) {
        console.log('Admin already exists. Skipping creation.');
        return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin
    const admin = await prisma.admin.create({
        data: {
            name: 'System Admin',
            email,
            password: hashedPassword,
            role: 'admin'
        }
    });
    
    console.log('Admin created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log('---------------------------');
}

main()
    .catch((e) => {
        console.error('Error creating admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

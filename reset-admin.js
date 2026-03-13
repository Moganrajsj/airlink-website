const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@srirambroadband.com';
    const newPassword = 'admin123';
    
    console.log(`--- Resetting Password for ${email} ---`);
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`Generated Hash: ${hashedPassword}`);
    
    const admin = await prisma.admin.update({
        where: { email },
        data: { password: hashedPassword }
    });
    
    console.log('Password reset successfully.');
    console.log(`New credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

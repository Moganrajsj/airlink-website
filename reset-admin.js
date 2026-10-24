const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const newPassword = 'Srirambroadband_@2026';
    const emails = ['info@srirambroadband.com', 'admin@srirambroadband.com'];
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`Generated Hash: ${hashedPassword}`);

    for (const email of emails) {
        console.log(`--- Updating Password for ${email} ---`);
        try {
            await prisma.admin.update({
                where: { email },
                data: { password: hashedPassword }
            });
            console.log(`Password updated successfully for ${email}`);
        } catch (err) {
            console.warn(`Could not update ${email}:`, err.message);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// Patch DB using Prisma's own client ($executeRaw)
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Patching Lead table...');

    const leadAlters = [
        `ALTER TABLE "Lead" ADD COLUMN "mobile" TEXT NOT NULL DEFAULT ''`,
        `ALTER TABLE "Lead" ADD COLUMN "pincode" TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "interest" TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'contact_form'`,
        `ALTER TABLE "Lead" ADD COLUMN "assignedTo" TEXT`,
        `ALTER TABLE "Lead" ADD COLUMN "notes" TEXT`,
    ];

    const userAlters = [
        `ALTER TABLE "User" ADD COLUMN "resetToken" TEXT`,
        `ALTER TABLE "User" ADD COLUMN "resetTokenExpiry" DATETIME`,
    ];

    for (const sql of [...leadAlters, ...userAlters]) {
        try {
            await prisma.$executeRawUnsafe(sql);
            console.log('OK:', sql.slice(0, 70));
        } catch (e) {
            const msg = e.message || '';
            if (msg.includes('duplicate column') || msg.includes('already exists')) {
                console.log('SKIP (already exists):', sql.slice(10, 60));
            } else {
                console.error('ERROR', sql.slice(0, 60), '->', msg);
            }
        }
    }

    console.log('Done patching database!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

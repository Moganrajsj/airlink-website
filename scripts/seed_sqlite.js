const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(DB_PATH);

// Ensure table exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS SocialLink (
        id TEXT PRIMARY KEY,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT,
        status INTEGER NOT NULL DEFAULT 0,
        updatedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
    )
`).run();

const PLATFORMS = [
    'Facebook', 'Instagram', 'LinkedIn', 'YouTube', 
    'Pinterest', 'Twitter', 'WhatsApp', 'Telegram', 
    'TikTok', 'Snapchat', 'Website'
];

const now = Date.now();

for (const platform of PLATFORMS) {
    const existing = db.prepare('SELECT id FROM SocialLink WHERE platform = ?').get(platform);
    if (!existing) {
        const id = 'cl' + crypto.randomBytes(12).toString('hex');
        db.prepare(`
            INSERT INTO SocialLink (id, platform, url, status, updatedAt, createdAt) 
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(id, platform, '', 0, now, now);
        console.log(`Created: ${platform}`);
    } else {
        console.log(`Already exists: ${platform}`);
    }
}

const all = db.prepare('SELECT platform, url, status FROM SocialLink ORDER BY platform').all();
console.log('\nAll social links in DB:');
all.forEach(r => console.log(`  ${r.platform}: "${r.url}" [${r.status ? 'Active' : 'Hidden'}]`));

db.close();
console.log('\nDone!');

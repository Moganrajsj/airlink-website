const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const db = new Database(path.join('prisma', 'dev.db'));

// Create table if not exists
db.exec(`
    CREATE TABLE IF NOT EXISTS SocialLink (
        id TEXT PRIMARY KEY,
        platform TEXT NOT NULL,
        url TEXT NOT NULL DEFAULT '',
        icon TEXT,
        status INTEGER NOT NULL DEFAULT 0,
        updatedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
    )
`);

const PLATFORMS = [
    'Facebook', 'Instagram', 'LinkedIn', 'YouTube',
    'Pinterest', 'Twitter', 'WhatsApp', 'Telegram',
    'TikTok', 'Snapchat', 'Website'
];

const now = Date.now();
const insert = db.prepare(
    'INSERT OR IGNORE INTO SocialLink (id, platform, url, status, updatedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
);

for (const platform of PLATFORMS) {
    const id = 'cl' + crypto.randomBytes(12).toString('hex');
    try {
        // Try inserting with unique platform check
        const existing = db.prepare('SELECT id FROM SocialLink WHERE platform = ?').get(platform);
        if (!existing) {
            insert.run(id, platform, '', 0, now, now);
            console.log('Created: ' + platform);
        } else {
            console.log('Exists: ' + platform);
        }
    } catch (e) {
        console.log('Skip: ' + platform + ' - ' + e.message);
    }
}

const all = db.prepare('SELECT platform, url, status FROM SocialLink ORDER BY platform').all();
console.log('\nAll platforms in database:');
all.forEach(r => console.log('  - ' + r.platform + ' [' + (r.status ? 'Active' : 'Hidden') + '] ' + (r.url || '(no URL)')));
db.close();

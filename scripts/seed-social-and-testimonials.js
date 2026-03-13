const Database = require('better-sqlite3');
const path = require('path');
const { randomBytes } = require('crypto');

const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(DB_PATH);

function ensureSocialTable() {
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
}

function ensureTestimonialColumns() {
    // Check columns for Testimonial
    const cols = db.prepare("PRAGMA table_info(Testimonial)").all();
    const colNames = cols.map(c => c.name);

    if (!colNames.includes('person')) db.prepare("ALTER TABLE Testimonial ADD COLUMN person TEXT").run();
    if (!colNames.includes('city')) db.prepare("ALTER TABLE Testimonial ADD COLUMN city TEXT DEFAULT 'Tamil Nadu'").run();
    if (!colNames.includes('tag')) db.prepare("ALTER TABLE Testimonial ADD COLUMN tag TEXT").run();
    if (!colNames.includes('metric')) db.prepare("ALTER TABLE Testimonial ADD COLUMN metric TEXT").run();
    if (!colNames.includes('color')) db.prepare("ALTER TABLE Testimonial ADD COLUMN color TEXT DEFAULT '#FBBF24'").run();
}

async function seed() {
    console.log('--- Seeding Social Links & Enhancing Testimonials ---');

    // 1. Social Links
    ensureSocialTable();
    db.prepare('DELETE FROM SocialLink').run();
    const socialLinks = [
        { platform: 'Facebook', url: 'https://facebook.com/srirambroadband', status: 1 },
        { platform: 'Instagram', url: 'https://instagram.com/srirambroadband', status: 1 },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/sriram-broadband', status: 1 },
        { platform: 'YouTube', url: 'https://youtube.com/@srirambroadband', status: 1 },
        { platform: 'WhatsApp', url: 'https://wa.me/919344584000', status: 1 }
    ];

    const now = Date.now();
    const insertSocial = db.prepare('INSERT INTO SocialLink (id, platform, url, status, updatedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?)');
    
    for (const link of socialLinks) {
        const id = 'sl' + randomBytes(8).toString('hex');
        insertSocial.run(id, link.platform, link.url, link.status, now, now);
    }
    console.log(`Seeded ${socialLinks.length} social links.`);

    // 2. Testimonials
    ensureTestimonialColumns();
    // Update existing testimonials with better data
    const testimonials = [
        {
            name: "Rajesh Kumar",
            person: "Mr. Rajesh Kumar",
            role: "Professional Gamer & Streamer",
            city: "Dharmapuri",
            tag: "Gaming Community",
            content: "Switched to Airlink for the low latency. My ping in Valorant dropped from 40ms to 9ms. Absolutely stable and perfect for lag-free 4K streaming.",
            rating: 5,
            metric: "9ms Ping - Competitive Ready",
            color: "#60a5fa"
        },
        {
            name: "Sneha Reddy",
            person: "Ms. Sneha Reddy",
            role: "Freelance UI/UX Designer",
            city: "Hosur",
            tag: "Creative Professional",
            content: "The symmetrical upload/download speeds are a lifesaver. Uploading heavy Figma files and design assets is now instantaneous. No more missed deadlines!",
            rating: 5,
            metric: "1:1 Symmetrical Speed",
            color: "#a78bfa"
        },
        {
            name: "Vikram Singh",
            person: "Dr. Vikram Singh",
            role: "Hospital Administrator",
            city: "Salem",
            tag: "Healthcare Sector",
            content: "Reliable internet is critical for our diagnostic systems. Airlink's uptime has been incredible, and their support team is proactive and helpful 24/7.",
            rating: 5,
            metric: "99.9% Uptime Verified",
            color: "#34d399"
        },
        {
            name: "Priya Sharma",
            person: "Mrs. Priya Sharma",
            role: "Software Architect",
            city: "Chennai",
            tag: "Work From Home",
            content: "Working from home requires a rock-solid connection for continuous VC calls and VPN access. Airlink delivers consistent speeds even during peak hours.",
            rating: 5,
            metric: "Zero Jitter on VC Calls",
            color: "#fb923c"
        }
    ];

    const updateTestimonial = db.prepare(`
        UPDATE Testimonial 
        SET person = ?, role = ?, city = ?, tag = ?, content = ?, rating = ?, metric = ?, color = ?, isActive = 1
        WHERE name = ?
    `);

    let updatedCount = 0;
    for (const t of testimonials) {
        const result = updateTestimonial.run(t.person, t.role, t.city, t.tag, t.content, t.rating, t.metric, t.color, t.name);
        if (result.changes > 0) updatedCount++;
    }
    console.log(`Updated ${updatedCount} testimonials with premium fields.`);

    db.close();
    console.log('--- Seeding Completed ---');
}

seed().catch(console.error);

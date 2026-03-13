const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'));

db.exec(`
    CREATE TABLE IF NOT EXISTS Testimonial (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        status INTEGER NOT NULL DEFAULT 1,
        updatedAt INTEGER NOT NULL,
        createdAt INTEGER NOT NULL
    )
`);

const testimonials = [
    { name: "Rajesh Kumar", role: "Professional Gamer", content: "Switched to Airlink for the low latency. My ping in Valorant dropped from 40ms to 9ms. Absolutely stable and perfect for gaming.", rating: 5 },
    { name: "Sneha Reddy", role: "Freelance Designer", content: "The symmetrical speeds are a lifesaver. Uploading heavy design files to the cloud is now faster than ever. No more waiting!", rating: 5 },
    { name: "Vikram Singh", role: "Business Owner", content: "Reliable internet is crucial for my office. Airlink's uptime has been incredible, and their support team is always helpful.", rating: 5 },
    { name: "Priya Sharma", role: "Software Engineer", content: "Working from home requires a rock-solid connection. Airlink delivers consistent speeds day and night without any packet loss.", rating: 5 },
    { name: "Arun Krishnan", role: "Content Creator", content: "Streaming in 4K requires massive bandwidth, and Airlink handles it effortlessly. Best ISP I've ever used in Tamil Nadu.", rating: 5 },
    { name: "Karthik Raj", role: "Startup Founder", content: "We use Airlink's enterprise leased line for our office. The 1:1 uncontended bandwidth ensures our team of 50 stays productive 24/7.", rating: 5 },
    { name: "Anita Desai", role: "Online Educator", content: "Hosting live webinars with hundreds of students requires zero buffering. Airlink's fiber connection has been flawless for my virtual classes.", rating: 5 },
    { name: "Mohammed Tariq", role: "E-commerce Manager", content: "Managing multiple online stores needs instant sync. Ever since we moved to Airlink, our inventory systems update in real-time instantly.", rating: 5 }
];

const now = Date.now();

for (const t of testimonials) {
    const existing = db.prepare('SELECT id FROM Testimonial WHERE name = ?').get(t.name);
    if (!existing) {
        const id = 'cl' + crypto.randomBytes(12).toString('hex');
        db.prepare('INSERT INTO Testimonial (id, name, role, content, rating, status, updatedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, t.name, t.role, t.content, t.rating, 1, now, now);
        console.log('Created: ' + t.name);
    } else {
        console.log('Already exists: ' + t.name);
    }
}

const total = db.prepare('SELECT COUNT(*) as c FROM Testimonial').get();
console.log('\nTotal testimonials:', total.c);
db.close();

const D = require('better-sqlite3');
const cr = require('crypto');
const db = D('prisma/dev.db');

const testimonials = [
    ['Rajesh Kumar', 'Professional Gamer', 'Switched to Airlink for the low latency. My ping in Valorant dropped from 40ms to 9ms. Absolutely stable and perfect for gaming.', 5],
    ['Sneha Reddy', 'Freelance Designer', 'The symmetrical speeds are a lifesaver. Uploading heavy design files to the cloud is now faster than ever. No more waiting!', 5],
    ['Vikram Singh', 'Business Owner', 'Reliable internet is crucial for my office. Airlinkis uptime has been incredible, and their support team is always helpful.', 5],
    ['Priya Sharma', 'Software Engineer', 'Working from home requires a rock-solid connection. Airlink delivers consistent speeds day and night without any packet loss.', 5],
    ['Arun Krishnan', 'Content Creator', 'Streaming in 4K requires massive bandwidth, and Airlink handles it effortlessly. Best ISP ever used in Tamil Nadu.', 5],
    ['Karthik Raj', 'Startup Founder', 'We use the enterprise leased line for our office. The 1:1 uncontended bandwidth ensures our team stays productive 24/7.', 5],
    ['Anita Desai', 'Online Educator', 'Hosting live webinars with hundreds of students requires zero buffering. The fiber connection has been flawless for my virtual classes.', 5],
    ['Mohammed Tariq', 'E-commerce Manager', 'Managing multiple online stores needs instant sync. Our inventory systems update in real-time since we moved to Airlink.', 5]
];

// Check actual table schema
const schema = db.prepare("SELECT sql FROM sqlite_master WHERE name='Testimonial'").get();
console.log('Schema:', schema ? schema.sql : 'NOT FOUND');

if (schema) {
    const now = new Date().toISOString();
    for (const [n, r, c, rt] of testimonials) {
        const existing = db.prepare("SELECT id FROM Testimonial WHERE name=?").get(n);
        if (!existing) {
            const id = 'cl' + cr.randomBytes(12).toString('hex');
            // Try with DATETIME format
            try {
                db.prepare("INSERT INTO Testimonial(id,name,role,content,rating,updatedAt,createdAt) VALUES(?,?,?,?,?,?,?)").run(id, n, r, c, rt, now, now);
                console.log('Added:', n);
            } catch(e) {
                console.error('Failed to add', n, ':', e.message);
                // Attempt minimal insert
                try {
                    db.prepare("INSERT INTO Testimonial(id,name,role,content,rating) VALUES(?,?,?,?,?)").run(id, n, r, c, rt);
                    console.log('Added (minimal):', n);
                } catch(e2) {
                    console.error('Minimal also failed:', e2.message);
                }
            }
        } else {
            console.log('Exists:', n);
        }
    }
}

const count = db.prepare('SELECT COUNT(*) as c FROM Testimonial').get();
console.log('Total:', count.c);
db.close();

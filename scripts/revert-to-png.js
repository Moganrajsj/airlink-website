const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToRevert = [
  'public/images/broadband_ad_hero.webp',
  'public/images/plans_hero_background.webp',
  'public/images/banners/unlimited-entertainment-v2.webp',
  'public/images/offers/premium_wifi_bg.webp',
  'public/images/home_hero_new.webp',
  'public/images/infrastructure.webp',
  'public/images/offers/free_installation_bg.webp'
];

async function revertToPng() {
  console.log('--- Reverting Select Images to PNG ---');
  for (const relPath of imagesToRevert) {
    const fullPath = path.join(__dirname, '..', relPath);
    if (fs.existsSync(fullPath)) {
      const outputPath = fullPath.replace(/\.webp$/, '.png');
      try {
        await sharp(fullPath).toFile(outputPath);
        console.log(`Reverted: ${relPath} -> ${path.basename(outputPath)}`);
        // Optional: delete webp if you want to be clean, but user might have links to it? 
        // User said "dont convert", so let's delete webp to avoid confusion.
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.error(`Error reverting ${relPath}:`, err);
      }
    } else {
      console.warn(`File not found: ${relPath}`);
    }
  }
  console.log('--- Reversion Complete ---');
}

revertToPng();

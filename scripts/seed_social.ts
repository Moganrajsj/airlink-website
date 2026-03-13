import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLATFORMS = [
    'Facebook', 'Instagram', 'LinkedIn', 'YouTube', 
    'Pinterest', 'Twitter', 'WhatsApp', 'Telegram', 
    'TikTok', 'Snapchat', 'Website'
];

async function main() {
  console.log('Seeding social media platforms...')
  
  for (const platform of PLATFORMS) {
    const existing = await prisma.socialLink.findFirst({
      where: { platform }
    })
    
    if (!existing) {
      await prisma.socialLink.create({
        data: {
          platform,
          url: '',
          status: false // Default to false until a URL is added
        }
      })
      console.log(`Created platform entry: ${platform}`)
    } else {
      console.log(`Platform already exists: ${platform}`)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

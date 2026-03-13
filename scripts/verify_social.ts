import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const links = await prisma.socialLink.findMany()
  console.log(`Total social links: ${links.length}`)
  links.forEach(l => {
    console.log(`- ${l.platform}: ${l.url || '(no URL)'} [${l.status ? 'Active' : 'Hidden'}]`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

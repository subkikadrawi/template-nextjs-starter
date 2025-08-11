const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password', 10)
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: passwordHash }
  })
  console.log('Seeded user:', user.username)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())

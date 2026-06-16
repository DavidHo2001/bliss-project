import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  //Create initial admin user
  await prisma.user.upsert({
    where: { email: 'admin@bliss.com' },
    update: {},
    create: {
      name: 'Admin User',
      age: 25,
      hkid: 'Y123456(7)',
      email: 'admin@bliss.com',
      password: await bcrypt.hash('Aa123456', 10),
      role: Role.ADMIN,
    },
  });

  // Normal Users
  await prisma.user.upsert({
    where: { email: 'davidho@bliss.com' },
    update: {},
    create: {
      name: 'David Ho',
      age: 25,
      hkid: 'Y987654(3)',
      email: 'davidho@bliss.com',
      password: await bcrypt.hash('Aa123456', 10),
      role: Role.USER,
    },
  });

  //Fake user for get-user endpoint
  for (let i = 1; i <= 29; i++) {
    await prisma.user.upsert({
      where: { email: `user${i}@bliss.com` },
      update: {},
      create: {
        name: `Test User ${i}`,
        age: 20 + (i % 40),
        hkid: `Y${String(i).padStart(6, '0')}(${i % 9})`,
        email: `user${i}@bliss.com`,
        password: await bcrypt.hash('Test1234', 10),
        role: Role.USER,
      },
    });
  }

  console.log('Seed completed: 31 users created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

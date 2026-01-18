import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  const hash = await bcrypt.hash('123456', 10);

  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        email: 'alice@test.com',
        username: 'alice',
        password: hash,
      },
      {
        email: 'bob@test.com',
        username: 'bob',
        password: hash,
      },
    ],
  });

  console.log('Seeded users');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

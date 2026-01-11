import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        email: 'alice@test.com',
        username: 'alice',
        password: '123456',
      },
      {
        email: 'bob@test.com',
        username: 'bob',
        password: '123456',
      },
    ],
  });

  console.log('Seeded users');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

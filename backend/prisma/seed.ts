/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'olaachieng123@gmail.com';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123', 10);

    await prisma.user.create({
      data: {
        fullName: 'Leahs Crochet',
        email: adminEmail,
        password: hashedPassword,
        phone: '0700000000',
        role: 'admin',
      },
    });

    console.log('Admin created successfully');
  } else {
    console.log('Admin already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

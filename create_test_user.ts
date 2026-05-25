import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('Password@123', 10);
  await prisma.user.upsert({
    where: { email: 'amirhossain.limon@gmail.com' },
    update: { password: hashedPassword, role: 'ADMIN', active: true, emailVerified: new Date() },
    create: {
      email: 'amirhossain.limon@gmail.com',
      name: 'Amir Hossain',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
      emailVerified: new Date()
    },
  });
  console.log('User created/updated');
}

main().catch(console.error).finally(() => prisma.$disconnect());

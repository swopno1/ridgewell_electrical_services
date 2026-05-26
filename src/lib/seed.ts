// src/lib/seed.ts
import 'dotenv/config';
import { prisma } from './prisma';
import { hashPassword } from './auth-utils';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (purged first for clean seed)
  await prisma.approval.deleteMany();
  await prisma.timesheet.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.project.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  console.log('📝 Creating admin user...');
  
  const adminPassword = await hashPassword('5WordKomuna*');
  
  const admin = await prisma.user.create({
    data: {
      name: 'Md Amir Hossain',
      email: 'amirhossain.limon@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      active: true,
      emailVerified: new Date(),
    },
  });

  console.log('✨ Database seeded successfully!');
  console.log('\n📋 Seeded Data Summary:');
  console.log(`  - Users: 1 admin (${admin.email})`);
  console.log('\n🔐 Default Credentials:');
  console.log('  Admin: amirhossain.limon@gmail.com / Admin@123456**');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

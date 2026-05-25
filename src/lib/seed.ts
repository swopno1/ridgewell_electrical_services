// src/lib/seed.ts
import 'dotenv/config';
import { prisma } from './prisma';
import { hashPassword } from './auth-utils';
import { addDays, startOfToday } from 'date-fns';

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
  console.log('📝 Creating users...');
  
  const adminPassword = await hashPassword('Admin@123456**');
  
  await prisma.user.create({
    data: {
      name: 'Md Amir Hossain',
      email: 'amirhossain.limon@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      active: true,
      emailVerified: new Date(),
    },
  });

  const managerPassword = await hashPassword('Manager@123456');
  const managers = [];
  const managerData = [
    { name: 'Callum Foley', email: 'callum.foley@ridgewell.co.uk' },
    { name: 'David Bernard', email: 'david.bernard@ridgewell.co.uk' },
  ];

  for (const mgr of managerData) {
    const created = await prisma.user.create({
      data: {
        name: mgr.name,
        email: mgr.email,
        password: managerPassword,
        role: 'MANAGER',
        active: true,
        emailVerified: new Date(),
      },
    });
    managers.push(created);
  }

  const employees = [];
  const employeeData = [
    { name: 'Louis Michael', email: 'louis.michael@ridgewell.co.uk' },
    { name: 'Callum Begg', email: 'callum.begg@ridgewell.co.uk' },
    { name: 'Conor Mcnaney', email: 'conor.mcnaney@ridgewell.co.uk' },
    { name: 'Jaylan Adu-Awuah', email: 'jaylan.aduawuah@ridgewell.co.uk' },
    { name: 'Allen Tyrell', email: 'allen.tyrell@ridgewell.co.uk' },
    { name: 'Paul Labett', email: 'paul.labett@ridgewell.co.uk' },
  ];

  const employeePassword = await hashPassword('Employee@123456');
  for (const emp of employeeData) {
    const created = await prisma.user.create({
      data: {
        name: emp.name,
        email: emp.email,
        password: employeePassword,
        role: 'EMPLOYEE',
        active: true,
        emailVerified: new Date(),
      },
    });
    employees.push(created);
  }

  // 2. Create Projects
  console.log('📋 Creating projects...');

  const projects = [];
  const projectData = [
    {
      name: 'Website Redesign',
      client: 'ABC Corporation',
      description: 'Complete redesign of company website',
    },
    {
      name: 'Mobile App Development',
      client: 'XYZ Startup',
      description: 'Native iOS and Android application',
    },
    {
      name: 'Data Migration',
      client: 'Legacy Systems Inc',
      description: 'Migrate data from old system to new platform',
    },
    {
      name: 'Internal Tools',
      client: 'Internal',
      description: 'Building internal productivity tools',
    },
  ];

  for (const project of projectData) {
    const existing = await prisma.project.findFirst({
      where: { name: project.name }
    });
    if (existing) {
      projects.push(existing);
    } else {
      const created = await prisma.project.create({
        data: project
      });
      projects.push(created);
    }
  }

  // 3. Create Timesheets
  console.log('⏱️ Creating timesheets...');

  const today = startOfToday();
  for (const employee of employees) {
    for (let i = 0; i < 5; i++) {
      const date = addDays(today, -i);
      const randomProject = projects[Math.floor(Math.random() * projects.length)];

      const timeOn = new Date(date);
      timeOn.setHours(9, 0, 0, 0);

      const timeOff = new Date(date);
      timeOff.setHours(17, 30, 0, 0);

      const totalHours = 8.5;
      const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

      await prisma.timesheet.upsert({
        where: {
          userId_date: {
            userId: employee.id,
            date: new Date(date.toDateString()),
          },
        },
        update: {},
        create: {
          userId: employee.id,
          projectId: randomProject.id,
          date: new Date(date.toDateString()),
          timeOn,
          timeOff,
          breakDuration: 30,
          totalHours,
          overtimeHours,
          notes: `Worked on ${randomProject.name}`,
          status: i > 2 ? 'APPROVED' : 'PENDING',
        },
      });
    }
  }

  // 4. Create Leave Requests
  console.log('🏖️ Creating leave requests...');

  for (const employee of employees) {
    const startDate = addDays(today, 10);
    const endDate = addDays(startDate, 2);

    const existingLeave = await prisma.leaveRequest.findFirst({
      where: {
        userId: employee.id,
        startDate,
        endDate,
      },
    });

    if (!existingLeave) {
      await prisma.leaveRequest.create({
        data: {
          userId: employee.id,
          leaveType: 'ANNUAL',
          startDate,
          endDate,
          totalDays: 3,
          reason: 'Annual vacation',
          status: 'PENDING',
        },
      });
    }
  }

  // 5. Create Leave Balances
  console.log('📊 Creating leave balances...');

  const year = new Date().getFullYear();
  for (const employee of employees) {
    await prisma.leaveBalance.upsert({
      where: {
        userId_year: {
          userId: employee.id,
          year,
        },
      },
      update: {},
      create: {
        userId: employee.id,
        year,
        annualEntitled: 20,
        annualUsed: 3,
        sickUsed: 1,
      },
    });
  }

  // 6. Create Sample Approvals
  console.log('✅ Creating approvals...');

  const approvedTimesheets = await prisma.timesheet.findMany({
    where: { status: 'APPROVED' },
    take: 3,
  });

  for (const timesheet of approvedTimesheets) {
    const existingApproval = await prisma.approval.findFirst({
      where: {
        timesheetId: timesheet.id,
      },
    });
    if (!existingApproval) {
      await prisma.approval.create({
        data: {
          approverUserId: managers[0].id,
          timesheetId: timesheet.id,
          type: 'TIMESHEET',
          approved: true,
          comment: 'Looks good',
          approvedAt: new Date(),
        },
      });
    }
  }

  console.log('✨ Database seeded successfully!');
  console.log('\n📋 Seeded Data Summary:');
  console.log(`  - Users: 1 admin, ${managers.length} managers, ${employees.length} employees`);
  console.log(`  - Projects: ${projects.length}`);
  console.log(`  - Timesheets: ${employees.length * 5}`);
  console.log(`  - Leave Requests: ${employees.length}`);
  console.log(`  - Leave Balances: ${employees.length}`);
  console.log('\n🔐 Default Credentials:');
  console.log('  Admin: amirhossain.limon@gmail.com / Admin@123456**');
  console.log('  Manager: callum.foley@ridgewell.co.uk / Manager@123456');
  console.log('  Employee: louis.michael@ridgewell.co.uk / Employee@123456');
  console.log('           (same password for all employees)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Prisma } from '@prisma/client';

async function checkSchema() {
  console.log("Checking User model fields in generated Prisma client...");
  const fields = Prisma.UserScalarFieldEnum;
  const requiredFields = [
    'hourlyRate',
    'overtimeRate',
    'annualLeaveQuota',
    'designation',
    'standardWorkHours'
  ];

  let missing = false;
  requiredFields.forEach(field => {
    if (field in fields) {
      console.log(`✅ Field '${field}' exists.`);
    } else {
      console.log(`❌ Field '${field}' is MISSING.`);
      missing = true;
    }
  });

  if (missing) {
    process.exit(1);
  } else {
    console.log("All salary fields are present in the Prisma client.");
  }
}

checkSchema();

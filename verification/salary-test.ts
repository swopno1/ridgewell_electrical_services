import { prisma } from '../src/lib/prisma';

async function testSalaryFields() {
  console.log("Testing user model for new salary fields...");
  try {
    const user = await prisma.user.findFirst();
    if (user) {
      console.log("User found, checking fields:");
      console.log("- hourlyRate:", user.hourlyRate);
      console.log("- overtimeRate:", user.overtimeRate);
      console.log("- annualLeaveQuota:", user.annualLeaveQuota);
      console.log("- designation:", user.designation);
      console.log("- standardWorkHours:", user.standardWorkHours);
    } else {
      console.log("No user found in DB, please seed first.");
    }
  } catch (error) {
    console.error("Error accessing user fields:", error);
    process.exit(1);
  }
}

testSalaryFields();

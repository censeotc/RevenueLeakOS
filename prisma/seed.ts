import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.business.upsert({
    where: { id: "biz_sunrise" },
    update: {},
    create: {
      id: "biz_sunrise",
      name: "Sunrise Comfort Co.",
      timezone: "America/Chicago",
      staleEstimateDays: 5,
      attributionWindowDays: 30,
      highValueThreshold: 120000,
      duplicateMissedCallWindowHours: 12,
      phone: "(512) 555-0192",
      website: "https://revenueleak.local",
      users: {
        create: [{
          id: "user_owner",
          name: "Avery Lane",
          email: "avery@example.com",
          role: "OWNER",
          phone: "(512) 555-0100"
        }]
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

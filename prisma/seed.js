const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding fake users for demo...");

  // Clean existing demo users
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.statusEvent.deleteMany();
  await prisma.application.deleteMany();
  await prisma.user.deleteMany();

  const users = [
    {
      id: "usr_ramesh_01",
      name: "Ramesh Kumar Sharma (रमेश कुमार)",
      phone: "+91 98765 43210",
      email: "ramesh.sharma.demo@example.com",
      locale: "hi",
    },
    {
      id: "usr_ananya_02",
      name: "Ananya Ghosh (অনন্যা ঘোষ)",
      phone: "+91 91234 56789",
      email: "ananya.ghosh.demo@example.com",
      locale: "bn",
    },
    {
      id: "usr_karthik_03",
      name: "Karthik Subramanian (கார்த்திக்)",
      phone: "+91 94444 12345",
      email: "karthik.sub.demo@example.com",
      locale: "ta",
    },
    {
      id: "usr_sunita_04",
      name: "Sunita Deshmukh (सुनिता देशमुख)",
      phone: "+91 98220 11223",
      email: "sunita.deshmukh.demo@example.com",
      locale: "mr",
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  // Create one sample application so status tracking has something right away
  const sampleApp = await prisma.application.create({
    data: {
      id: "APP-2026-849102",
      schemeId: "pm-kisan",
      userId: "usr_ramesh_01",
      status: "UNDER_REVIEW",
      formData: JSON.stringify({
        applicantName: "Ramesh Kumar Sharma",
        aadhaarMasked: "XXXX-XXXX-4819",
        mobile: "+91 98765 43210",
        state: "Uttar Pradesh",
        district: "Varanasi",
        landSize: "1.5 Hectares",
        khataNumber: "KH-4821/2026",
        bankName: "State Bank of India",
        accountMasked: "XXXXXX5920",
        ifsc: "SBIN0001234",
      }),
    },
  });

  await prisma.statusEvent.createMany({
    data: [
      {
        applicationId: sampleApp.id,
        fromStatus: "DRAFT",
        toStatus: "SUBMITTED",
        note: "Application submitted online by citizen. Acknowledgement generated.",
      },
      {
        applicationId: sampleApp.id,
        fromStatus: "SUBMITTED",
        toStatus: "UNDER_REVIEW",
        note: "Revenue Officer assigned for land parcel and RoR verification.",
      },
    ],
  });

  await prisma.notification.create({
    data: {
      userId: "usr_ramesh_01",
      applicationId: sampleApp.id,
      channel: "web",
      message: "Application APP-2026-849102 for PM-KISAN is now Under Review by the Nodal Officer.",
    },
  });

  console.log("Seeding complete! 4 demo users and 1 sample application created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

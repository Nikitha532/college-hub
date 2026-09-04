import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const colleges = [
  {
    name: "Indian Institute of Technology, Bombay",
    location: "Mumbai, Maharashtra",
    fees: 220000,
    rating: 4.8,
    overview: "Premier public technical university renowned for engineering and research excellence.",
    placementAvg: 2180000,
    highestPackage: 16800000,
    courses: ["Computer Science", "Electrical", "Mechanical", "Civil"]
  },
  {
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    fees: 540000,
    rating: 4.6,
    overview: "A leading private deemed university known for merit-only admissions and strong alumni network.",
    placementAvg: 1900000,
    highestPackage: 6000000,
    courses: ["Computer Science", "Electronics", "Chemical"]
  },
  {
    name: "National Institute of Technology, Trichy",
    location: "Tiruchirappalli, Tamil Nadu",
    fees: 180000,
    rating: 4.5,
    overview: "Top-ranked NIT offering high-tier engineering education with outstanding placement metrics.",
    placementAvg: 1550000,
    highestPackage: 5200000,
    courses: ["Computer Science", "Instrumentation", "Mechanical"]
  },
  {
    name: "Delhi Technological University",
    location: "New Delhi, Delhi",
    fees: 200000,
    rating: 4.4,
    overview: "A public university with exceptional industry connections and vibrant campus culture.",
    placementAvg: 1400000,
    highestPackage: 4800000,
    courses: ["Software Engineering", "IT", "Mathematics & Computing"]
  }
];

async function main() {
  await prisma.college.deleteMany({});
  for (const c of colleges) {
    await prisma.college.create({ data: c });
  }
  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  await prisma.$executeRaw`DELETE FROM "AiModel"`;
  console.log("Deleted all AiModel rows.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Cập nhật các CreditBucket hoạt động...");

  // 1) Find the active CreditBuckets
  const buckets = await prisma.creditBucket.findMany({
    where: { isActive: true },
    include: { product: true }
  });

  for (const bucket of buckets) {
    if (!bucket.product) continue;
    
    const productCredits = Number(bucket.product.credits);
    console.log(`Cập nhật bucket cho gói ${bucket.product.name} (id: ${bucket.id}):`);
    console.log(`  creditsTotal: ${Number(bucket.creditsTotal)} -> ${productCredits}`);
    console.log(`  creditsRemaining: ${Number(bucket.creditsRemaining)} -> ${productCredits}`);

    await prisma.creditBucket.update({
      where: { id: bucket.id },
      data: {
        creditsTotal: productCredits,
        creditsRemaining: productCredits
      }
    });
  }

  console.log("Hoàn thành cập nhật CreditBucket!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

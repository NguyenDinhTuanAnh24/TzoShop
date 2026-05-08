import { prisma } from "@/lib/prisma";

export async function getActiveProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      {
        apiFamily: "asc",
      },
      {
        priceVnd: "asc",
      },
    ],
  });

  return products;
}

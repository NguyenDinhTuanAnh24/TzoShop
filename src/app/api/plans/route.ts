import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  apiFamily: string;
  tier: string;
  credits: bigint;
  durationDays: number;
  priceVnd: number;
  apiKeyLimit: number;
  allowedModels: string[];
  allowedReasoning: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET() {
  try {
    const products: ProductItem[] = await prisma.product.findMany({
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
      select: {
        id: true,
        name: true,
        slug: true,
        apiFamily: true,
        tier: true,
        credits: true,
        durationDays: true,
        priceVnd: true,
        apiKeyLimit: true,
        allowedModels: true,
        allowedReasoning: true,
        isPopular: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as ProductItem[];

    const data = products.map((product: ProductItem) => ({
      ...product,
      credits: product.credits.toString(),
    }));

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("GET /api/plans failed:", error);

    return NextResponse.json(
      {
        error: {
          message: "Không thể tải danh sách gói credits.",
        },
      },
      {
        status: 500,
      },
    );
  }
}

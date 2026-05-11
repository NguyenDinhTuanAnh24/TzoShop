import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const activeModels = await prisma.aiModel.findMany({
      where: { isActive: true },
      include: { provider: true },
      orderBy: { publicName: "asc" }
    });

    return NextResponse.json({
      object: "list",
      data: activeModels.map((model) => ({
        id: model.publicName,
        object: "model",
        name: model.publicName,
        family: model.apiFamily,
        provider_model: model.upstreamModel,
        provider: model.provider.name,
        description: `TzoShop AI Model - ${model.publicName}`,
      })),
    });
  } catch (error) {
    console.error("GET /api/v1/models error:", error);
    return NextResponse.json({ error: { message: "Internal Server Error" } }, { status: 500 });
  }
}

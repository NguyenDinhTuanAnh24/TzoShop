import { NextResponse } from "next/server";

import { MODEL_REGISTRY } from "@/lib/model-registry";

export async function GET() {
  return NextResponse.json({
    object: "list",
    data: MODEL_REGISTRY.map((model) => ({
      id: model.id,
      object: "model",
      name: model.name,
      family: model.family,
      provider_model: model.providerModel,
      description: model.description,
    })),
  });
}

import { NextResponse } from "next/server";
import { MODEL_REGISTRY } from "@/lib/model-registry";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: {
          message: "Missing API key. Please provide Authorization: Bearer <API_KEY>.",
          type: "authentication_error",
        },
      },
      { status: 401 }
    );
  }

  const apiKey = authHeader.replace("Bearer ", "").trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid API key.",
          type: "authentication_error",
        },
      },
      { status: 401 }
    );
  }

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

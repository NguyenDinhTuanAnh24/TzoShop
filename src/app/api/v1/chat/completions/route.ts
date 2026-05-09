import { NextResponse } from "next/server";
import { getModelById } from "@/lib/model-registry";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatCompletionBody = {
  model?: string;
  messages?: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
};

export async function POST(request: Request) {
  try {
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

    const body = (await request.json()) as ChatCompletionBody;

    if (!body.model) {
      return NextResponse.json(
        {
          error: {
            message: "Missing required field: model.",
            type: "invalid_request_error",
          },
        },
        { status: 400 }
      );
    }

    const selectedModel = getModelById(body.model);

    if (!selectedModel) {
      return NextResponse.json(
        {
          error: {
            message: `Model '${body.model}' is not supported.`,
            type: "invalid_request_error",
          },
        },
        { status: 400 }
      );
    }

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        {
          error: {
            message: "Missing required field: messages.",
            type: "invalid_request_error",
          },
        },
        { status: 400 }
      );
    }

    const lastUserMessage =
      [...body.messages].reverse().find((message) => message.role === "user")?.content ??
      "Hello";

    return NextResponse.json({
      id: `chatcmpl_mock_${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: selectedModel.id,
      provider_model: selectedModel.providerModel,
      family: selectedModel.family,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: `Mock response từ ${selectedModel.name}. Bạn vừa gửi: "${lastUserMessage}"`,
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 120,
        completion_tokens: 80,
        total_tokens: 200,
        charged_credits: 2500,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          message: "Invalid JSON body.",
          type: "invalid_request_error",
        },
      },
      { status: 400 }
    );
  }
}

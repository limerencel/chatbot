import { convertToModelMessages, streamText, UIMessage } from "ai";
import { ModelId, modelRegistry } from "@/lib/ai-models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json();

  // Check cookie 
  const session = req.cookies.get("auth");
  if (!session || session.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // User is authenticated, continue
  const selectedModel =
    modelRegistry[model as ModelId] || modelRegistry["gpt-5-mini"];

  const textStream = streamText({
    model: selectedModel,
    system: "You are a helpful assistant.",
    prompt: convertToModelMessages(messages),
  });

  return textStream.toUIMessageStreamResponse();
}

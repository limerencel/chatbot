import { convertToModelMessages, streamText, UIMessage } from "ai";
import { ModelId, modelRegistry } from "@/lib/ai-models";

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json();

  const selectedModel =
    modelRegistry[model as ModelId] || modelRegistry["gpt-5-mini"];

  const textStream = streamText({
    model: selectedModel,
    system: "You are a helpful assistant.",
    prompt: convertToModelMessages(messages),
  });

  return textStream.toUIMessageStreamResponse();
}

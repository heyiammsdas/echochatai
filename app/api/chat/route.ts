import { openrouter } from "@openrouter/ai-sdk-provider";
import {
  createUIMessageStreamResponse,
  toUIMessageStream,
  streamText,
  convertToModelMessages,
} from "ai";

import db from "@/lib/db";

export async function POST(request: Request) {
  const { messages, conversationId } = await request.json();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openrouter("openrouter/free"),
    messages: modelMessages,
  });

  result.text.then(async (text) => {
    if (!conversationId) return;

    await db.message.create({
      data: {
        conversationId,
        role: "assistant",
        content: text,
        model: "openrouter/free",
      },
    });
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
    }),
  });
}
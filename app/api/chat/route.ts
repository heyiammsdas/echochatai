import { openrouter } from "@openrouter/ai-sdk-provider";
import {
  createUIMessageStreamResponse,
  toUIMessageStream,
  streamText,
  convertToModelMessages,
} from "ai";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { redis } from "@/lib/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

const AVAILABLE_MODELS: Record<string, { name: string }> = {
  "openrouter/free": {
    name: "Free Auto",
  },
  "liquid/lfm-2.5-2.6b:free": {
    name: "Liquid LFM 2.5",
  },
  "nvidia/nemotron-3.5-lightning:free": {
    name: "Nemotron 3.5 Lightning",
  },
  "cohere/north-mini-code:free": {
    name: "Cohere North Mini Code",
  },
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await ratelimit.limit(`chat_${session.user.id}`);
  if (!success) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { messages, conversationId, model } = await request.json();

  const modelMessages = await convertToModelMessages(messages);

  const verifiedModel = AVAILABLE_MODELS[model] ? model : "openrouter/free";

  const result = streamText({
    model: openrouter(verifiedModel),
    messages: modelMessages,
  });

  result.text.then(async (text) => {
    if (!conversationId) return;

    await db.message.create({
      data: {
        conversationId,
        role: "assistant",
        content: text,
        model: verifiedModel,
      },
    });
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
    }),
  });
}
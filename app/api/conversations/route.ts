import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { redis } from "@/lib/redis";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const cacheKey = `conversations:${session.user.id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return Response.json(cached);
  }

  const conversations = await db.conversation.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  await redis.set(cacheKey, conversations, { ex: 60 });

  return Response.json(conversations);
}

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const conversation = await db.conversation.create({
    data: {
      title: "New Chat",
      userId: session.user.id,
    },
  });

  await redis.del(`conversations:${session.user.id}`);

  return Response.json(conversation);
}
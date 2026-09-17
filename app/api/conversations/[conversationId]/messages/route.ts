import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      userId: session.user.id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!conversation) {
    return Response.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  return Response.json(conversation);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  const { content } = await request.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      userId: session.user.id,
    },
  });

  if (!conversation) {
    return Response.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const message = await db.message.create({
    data: {
      conversationId,
      role: "user",
      content,
    },
  });

  let updatedTitle = conversation.title;
  if (conversation.title === "New Chat") {
    const newTitle =
      content.length > 40
        ? content.substring(0, 40) + "..."
        : content;

    await db.conversation.update({
      where: { id: conversationId },
      data: { title: newTitle },
    });
    
    // Invalidate cache since title changed
    const { redis } = await import("@/lib/redis");
    await redis.del(`conversations:${session.user.id}`);
    
    updatedTitle = newTitle;
  }

  return Response.json({ message, updatedTitle });
}
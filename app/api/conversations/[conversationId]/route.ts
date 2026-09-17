import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { redis } from "@/lib/redis";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  const { title } = await request.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trimmedTitle = title?.trim();
  if (!trimmedTitle) {
    return Response.json({ error: "Title cannot be empty" }, { status: 400 });
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      userId: session.user.id,
    },
  });

  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  const updatedConversation = await db.conversation.update({
    where: { id: conversationId },
    data: { title: trimmedTitle },
  });

  await redis.del(`conversations:${session.user.id}`);

  return Response.json(updatedConversation);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      userId: session.user.id,
    },
  });

  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  await db.conversation.delete({
    where: { id: conversationId },
  });

  await redis.del(`conversations:${session.user.id}`);

  return Response.json({ success: true });
}

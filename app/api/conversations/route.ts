import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import db from "@/lib/db";

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

  const conversations = await db.conversation.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

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

  return Response.json(conversation);
}
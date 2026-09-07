import db from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  const { content } = await request.json();

  const message = await db.message.create({
    data: {
      conversationId,
      role: "user",
      content,
    },
  });

  return Response.json(message);
}
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EchoChatApp from "@/components/chat/EchoChatApp";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return (
    <EchoChatApp
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    />
  );
}
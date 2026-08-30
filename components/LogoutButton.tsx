"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/login");
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
    >
      Sign out
    </Button>
  );
}
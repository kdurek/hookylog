"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/server/auth/client";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
            },
          },
        })
      }
    >
      Logout
    </Button>
  );
}

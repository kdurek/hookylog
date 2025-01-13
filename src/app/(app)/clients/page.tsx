import Clients from "@/app/(app)/clients/page.client";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";

export default async function ClientsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    await api.client.getAll.prefetch();
  }

  return (
    <HydrateClient>
      <Clients />
    </HydrateClient>
  );
}

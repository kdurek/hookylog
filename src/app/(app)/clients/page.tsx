import Clients from "@/app/(app)/clients/page.client";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function ClientsPage() {
  const session = await auth();

  if (session?.user) {
    await api.client.getAll.prefetch();
  }

  return (
    <HydrateClient>
      <Clients />
    </HydrateClient>
  );
}

import Payments from "@/app/(app)/payments/page.client";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";

export default async function PaymentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    await api.client.getAll.prefetch();
    await api.payment.getAll.prefetch();
  }

  return (
    <HydrateClient>
      <Payments />
    </HydrateClient>
  );
}

import Payments from "@/app/(app)/payments/page.client";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function PaymentsPage() {
  const session = await auth();

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

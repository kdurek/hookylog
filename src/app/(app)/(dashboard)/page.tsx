import { DashboardCard } from "@/app/(app)/(dashboard)/card";
import DashboardPayments from "@/app/(app)/(dashboard)/payments";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    await api.payment.getUnpaid.prefetch();
  }

  return (
    <HydrateClient>
      <div className="flex max-w-[100vw] flex-1 flex-col gap-4 p-4 md:max-w-[calc(100vw-16rem)]">
        <DashboardCard title="Unpaid payments" link="/payments">
          <DashboardPayments />
        </DashboardCard>
        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div> */}
        {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
      </div>
    </HydrateClient>
  );
}

"use client";

import { api } from "@/trpc/react";
import { getClientColumns } from "./columns";
import { DataTable } from "../../../components/ui/data-table";
import { useCallback, useMemo, useState } from "react";
import type { Client } from "@prisma/client";
import ClientForm from "@/app/(app)/clients/form";

export default function ClientsPageClient() {
  const [clients] = api.client.getAll.useSuspenseQuery();
  const deleteMutation = api.client.delete.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const onUpdate = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  }, []);

  const onDelete = useCallback(
    (client: Client) => {
      deleteMutation.mutate({ id: client.id });
    },
    [deleteMutation],
  );

  const clientsColumns = useMemo(
    () => getClientColumns({ onUpdate, onDelete }),
    [onDelete, onUpdate],
  );

  return (
    <div className="p-4">
      <DataTable
        columns={clientsColumns}
        data={clients}
        updateCreateComponent={
          <ClientForm
            isOpen={isDialogOpen}
            client={selectedClient}
            onOpenChange={(value) => {
              setIsDialogOpen(value);
              if (!value) {
                setSelectedClient(null);
              }
            }}
          />
        }
      />
    </div>
  );
}

"use client";

import { api } from "@/trpc/react";
import { getClientColumns } from "./columns";
import { DataTable } from "../../../components/ui/data-table";
import { useCallback, useMemo, useState } from "react";
import type { Client } from "@prisma/client";
import ClientForm from "@/app/(app)/clients/form";
import { ClientDelete } from "@/app/(app)/clients/delete";

export default function ClientsPageClient() {
  const [clients] = api.client.getAll.useSuspenseQuery();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const onUpdate = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  }, []);

  const onDelete = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  }, []);

  const clientsColumns = useMemo(
    () => getClientColumns({ onUpdate, onDelete }),
    [onDelete, onUpdate],
  );

  return (
    <div className="max-w-[100vw] p-4 md:max-w-[calc(100vw-16rem)]">
      <ClientDelete
        isOpen={isDeleteDialogOpen}
        client={selectedClient}
        onOpenChange={(value) => {
          setIsDeleteDialogOpen(value);
          if (!value) {
            setSelectedClient(null);
          }
        }}
      />
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

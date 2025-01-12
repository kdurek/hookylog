"use client";

import { api } from "@/trpc/react";
import { getPaymentColumns } from "./columns";
import { DataTable } from "../../../components/ui/data-table";
import { useCallback, useMemo, useState } from "react";
import type { Payment } from "@prisma/client";
import PaymentForm from "@/app/(app)/payments/form";

export default function PaymentsPageClient() {
  const [payments] = api.payment.getAll.useSuspenseQuery();
  const deleteMutation = api.payment.delete.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const onUpdate = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  }, []);

  const onDelete = useCallback(
    (payment: Payment) => {
      deleteMutation.mutate({ id: payment.id });
    },
    [deleteMutation],
  );

  const paymentsColumns = useMemo(
    () => getPaymentColumns({ onUpdate, onDelete }),
    [onDelete, onUpdate],
  );

  return (
    <div className="p-4">
      <DataTable
        columns={paymentsColumns}
        data={payments}
        updateCreateComponent={
          <PaymentForm
            isOpen={isDialogOpen}
            payment={selectedPayment}
            onOpenChange={(value) => {
              setIsDialogOpen(value);
              if (!value) {
                setSelectedPayment(null);
              }
            }}
          />
        }
      />
    </div>
  );
}

"use client";

import { api } from "@/trpc/react";
import { getPaymentColumns } from "./columns";
import { DataTable } from "../../../components/ui/data-table";
import { useCallback, useMemo, useState } from "react";
import type { Payment } from "@prisma/client";
import PaymentForm from "@/app/(app)/payments/form";
import { toast } from "sonner";

export default function PaymentsPageClient() {
  const [payments] = api.payment.getAll.useSuspenseQuery();
  const deleteMutation = api.payment.delete.useMutation({
    onSuccess: () => {
      toast.success("Payment was deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const setAsPaidMutation = api.payment.setAsPaid.useMutation({
    onSuccess: () => {
      toast.success("Payment was set as paid successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const onSetAsPaid = useCallback(
    (payment: Payment) => {
      setAsPaidMutation.mutate({ id: payment.id });
    },
    [setAsPaidMutation],
  );

  const paymentsColumns = useMemo(
    () => getPaymentColumns({ onUpdate, onDelete, onSetAsPaid }),
    [onUpdate, onDelete, onSetAsPaid],
  );

  return (
    <div className="max-w-[100vw] p-4 md:max-w-[calc(100vw-16rem)]">
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

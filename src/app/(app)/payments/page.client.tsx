"use client";

import { api } from "@/trpc/react";
import { getPaymentColumns } from "./columns";
import { DataTable } from "../../../components/ui/data-table";
import { useCallback, useMemo, useState } from "react";
import type { Payment } from "@prisma/client";
import PaymentForm from "@/app/(app)/payments/form";
import SetAsPaidForm from "@/app/(app)/payments/set-as-paid-form";
import { PaymentDelete } from "@/app/(app)/payments/delete";

export default function PaymentsPageClient() {
  const [payments] = api.payment.getAll.useSuspenseQuery();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isSetAsPaidDialogOpen, setIsSetAsPaidDialogOpen] =
    useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const onUpdate = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setIsUpdateDialogOpen(true);
  }, []);

  const onDelete = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setIsDeleteDialogOpen(true);
  }, []);

  const onSetAsPaid = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setIsSetAsPaidDialogOpen(true);
  }, []);

  const paymentsColumns = useMemo(
    () => getPaymentColumns({ onUpdate, onDelete, onSetAsPaid }),
    [onUpdate, onDelete, onSetAsPaid],
  );

  return (
    <div className="max-w-[100vw] p-4 md:max-w-[calc(100vw-16rem)]">
      <SetAsPaidForm
        isOpen={isSetAsPaidDialogOpen}
        payment={selectedPayment}
        onOpenChange={(value) => {
          setIsSetAsPaidDialogOpen(value);
          if (!value) {
            setSelectedPayment(null);
          }
        }}
      />
      <PaymentDelete
        isOpen={isDeleteDialogOpen}
        payment={selectedPayment}
        onOpenChange={(value) => {
          setIsDeleteDialogOpen(value);
          if (!value) {
            setSelectedPayment(null);
          }
        }}
      />
      <DataTable
        columns={paymentsColumns}
        data={payments}
        updateCreateComponent={
          <PaymentForm
            isOpen={isUpdateDialogOpen}
            payment={selectedPayment}
            onOpenChange={(value) => {
              setIsUpdateDialogOpen(value);
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

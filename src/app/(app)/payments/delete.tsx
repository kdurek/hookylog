"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Payment } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentDeleteProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  payment: Payment | null;
}

export function PaymentDelete({
  isOpen,
  onOpenChange,
  payment,
}: PaymentDeleteProps) {
  const deleteMutation = api.payment.delete.useMutation({
    onSuccess: () => {
      toast.success("Payment was deleted successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = () => {
    if (payment) {
      deleteMutation.mutate({ id: payment.id });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete payment
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={deleteMutation.isPending} onClick={onSubmit}>
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

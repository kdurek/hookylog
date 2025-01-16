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
import type { Client } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ClientDeleteProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  client: Client | null;
}

export function ClientDelete({
  isOpen,
  onOpenChange,
  client,
}: ClientDeleteProps) {
  const deleteMutation = api.client.delete.useMutation({
    onSuccess: () => {
      toast.success("Client was deleted successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = () => {
    if (client) {
      deleteMutation.mutate({ id: client.id });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete client
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

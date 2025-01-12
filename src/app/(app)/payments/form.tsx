import { Button } from "@/components/ui/button";
import CurrencyInput from "@/components/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import type { Payment } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertCurrencyToNumber,
  isAmountWithinRange,
  MAX_VALUE,
} from "@/lib/utils";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  clientId: z
    .string({
      required_error: "Client is empty",
    })
    .cuid(),
  amount: z
    .string({
      required_error: "Amount is empty",
    })
    .refine(
      (value) => {
        return isAmountWithinRange(convertCurrencyToNumber(value));
      },
      { message: `Amount should be between - ${MAX_VALUE} and ${MAX_VALUE}` },
    ),
});

interface PaymentFormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  payment: Payment | null;
}

const PaymentForm = ({ isOpen, onOpenChange, payment }: PaymentFormProps) => {
  const [clients] = api.client.getAll.useSuspenseQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      amount: "",
    },
    mode: "onChange",
  });

  const createMutation = api.payment.create.useMutation({
    onSuccess: () => onOpenChange(false),
  });

  const updateMutation = api.payment.update.useMutation({
    onSuccess: () => onOpenChange(false),
  });

  useEffect(() => {
    if (payment) {
      form.reset({
        clientId: payment.clientId,
        amount: Number(payment.amount).toFixed(2),
      });
    } else {
      form.reset({
        clientId: "",
        amount: "",
      });
    }
  }, [form, isOpen, payment]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (
    values: z.infer<typeof formSchema>,
  ) => {
    const newPayment = {
      clientId: values.clientId,
      amount: convertCurrencyToNumber(values.amount),
    };
    if (payment) {
      updateMutation.mutate({ ...newPayment, id: payment.id });
    } else {
      createMutation.mutate(newPayment);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {payment ? "Update the payment" : "Create new payment"}
          </DialogTitle>
          <DialogDescription>
            {payment
              ? "You can update the payment details here"
              : "You can create a new payment here"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="amount"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      value={value}
                      onValueChange={(value) => onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="button"
            disabled={
              !form.formState.isValid ||
              updateMutation.isPending ||
              createMutation.isPending
            }
            onClick={form.handleSubmit(onSubmit)}
          >
            {(updateMutation.isPending || createMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;

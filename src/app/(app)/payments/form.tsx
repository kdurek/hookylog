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
import { format } from "date-fns";
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
import { PaymentSchedule, type Payment } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cn,
  convertCurrencyToNumber,
  isAmountWithinRange,
  MAX_VALUE,
  removeTimezoneFromDate,
} from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Name is empty",
    })
    .min(3),
  clientId: z
    .string({
      required_error: "Client is empty",
    })
    .cuid(),
  date: z.date({
    required_error: "Date is empty",
  }),
  schedule: z.nativeEnum(PaymentSchedule, {
    required_error: "Schedule is empty",
  }),
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
      name: "",
      clientId: "",
      date: undefined,
      schedule: undefined,
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
        name: payment.name,
        clientId: payment.clientId,
        date: new Date(payment.date),
        schedule: payment.schedule,
        amount: Number(payment.amount).toFixed(2),
      });
    } else {
      form.reset({
        name: "",
        clientId: "",
        date: undefined,
        schedule: undefined,
        amount: "",
      });
    }
  }, [form, isOpen, payment]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (
    values: z.infer<typeof formSchema>,
  ) => {
    const newPayment = {
      name: values.name,
      clientId: values.clientId,
      date: removeTimezoneFromDate(values.date),
      schedule: values.schedule,
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
          <form id="payment-form" className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a schedule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(PaymentSchedule).map((schedule) => (
                        <SelectItem key={schedule} value={schedule}>
                          {schedule}
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
            type="submit"
            form="payment-form"
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

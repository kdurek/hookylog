import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Payment } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Name is empty",
    })
    .min(3),
});

interface PaymentFormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  payment: Payment | null;
}

const SetAsPaidForm = ({ isOpen, onOpenChange, payment }: PaymentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const setAsPaidMutation = api.payment.setAsPaid.useMutation({
    onSuccess: () => {
      toast.success("Payment was set as paid successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (payment) {
      form.reset({
        name: payment.name,
      });
    }
  }, [form, isOpen, payment]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (
    values: z.infer<typeof formSchema>,
  ) => {
    const newPayment = {
      name: values.name,
    };
    if (payment) {
      setAsPaidMutation.mutate({ ...newPayment, id: payment.id });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set as paid</DialogTitle>
          <DialogDescription>
            {payment
              ? "You can update the payment details here"
              : "You can create a new payment here"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="set-as-paid-form" className="space-y-4">
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
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="set-as-paid-form"
            disabled={!form.formState.isValid || setAsPaidMutation.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {setAsPaidMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetAsPaidForm;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type { Client } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string({
    required_error: "Name is empty",
  }),
  email: z.string({
    required_error: "Email is empty",
  }),
});

interface ClientFormProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  client: Client | null;
}

const ClientForm = ({ isOpen, onOpenChange, client }: ClientFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onChange",
  });

  const createMutation = api.client.create.useMutation({
    onSuccess: () => onOpenChange(false),
  });

  const updateMutation = api.client.update.useMutation({
    onSuccess: () => onOpenChange(false),
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        email: client.email,
      });
    } else {
      form.reset({
        name: "",
        email: "",
      });
    }
  }, [form, isOpen, client]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (
    values: z.infer<typeof formSchema>,
  ) => {
    const newClient = {
      name: values.name,
      email: values.email,
    };
    if (client) {
      updateMutation.mutate({ ...newClient, id: client.id });
    } else {
      createMutation.mutate(newClient);
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
            {client ? "Update the client" : "Create new client"}
          </DialogTitle>
          <DialogDescription>
            {client
              ? "You can update the client details here"
              : "You can create a new client here"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
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
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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

export default ClientForm;

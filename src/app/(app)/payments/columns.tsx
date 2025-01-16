"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MoneyWithCurrency from "@/components/ui/money-with-currency";
import { formatDate } from "@/lib/utils";
import { PaymentStatus, type Prisma } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

type PaymentWithClient = Prisma.PaymentGetPayload<{
  include: { client: true };
}>;

interface PaymentColumnsProps {
  onUpdate: (payment: PaymentWithClient) => void;
  onDelete: (payment: PaymentWithClient) => void;
  onSetAsPaid: (payment: PaymentWithClient) => void;
}

export const getPaymentColumns = ({
  onUpdate,
  onDelete,
  onSetAsPaid,
}: PaymentColumnsProps): ColumnDef<PaymentWithClient>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4">
        <Badge
          variant="outline"
          className={
            row.original.status === PaymentStatus.PAID
              ? "border-green-500"
              : "border-red-500"
          }
        >
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => <div>{row.original.client.name}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4">{formatDate(row.original.date)}</div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: ({ row }) => <div>{row.original.schedule}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <MoneyWithCurrency amount={Number(row.original.amount)} />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onSetAsPaid(row.original)}
              disabled={row.original.status === PaymentStatus.PAID}
            >
              Set as paid
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onUpdate(row.original)}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row.original)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

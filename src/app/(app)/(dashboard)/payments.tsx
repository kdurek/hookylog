import MoneyWithCurrency from "@/components/ui/money-with-currency";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { api } from "@/trpc/server";

export default async function DashboardPayments() {
  const payments = await api.payment.getUnpaid();
  const totalAmount = payments.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.name}</TableCell>
              <TableCell>{payment.client.name}</TableCell>
              <TableCell className="text-nowrap">
                {formatDate(payment.date)}
              </TableCell>
              <TableCell className="text-right">
                <MoneyWithCurrency amount={Number(payment.amount)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              <MoneyWithCurrency amount={Number(totalAmount)} />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

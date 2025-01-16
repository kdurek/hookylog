import {
  formatCurrency,
  formatDate,
  removeTimezoneFromDate,
} from "@/lib/utils";
import { db } from "@/server/db";
import {
  createDiscordMessage,
  sendDiscordNotification,
} from "@/server/notification/discord";
import { PaymentStatus } from "@prisma/client";
import { type CronJobParams } from "cron";
import { startOfToday } from "date-fns";

export const notificationJob: CronJobParams = {
  cronTime: "0 0 0 * * *",
  onTick: async function () {
    const payments = await db.payment.findMany({
      where: {
        status: PaymentStatus.UNPAID,
        date: {
          lte: removeTimezoneFromDate(startOfToday()),
        },
      },
      include: {
        client: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const paymentsByDate = payments.reduce<Record<string, typeof payments>>(
      (acc, payment) => {
        const dateKey = payment.date.toISOString().slice(0, 10);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(payment);
        return acc;
      },
      {},
    );

    const notification = createDiscordMessage()
      .setUsername("HookyLog")
      .setTitle(
        `Payments ${formatDate(removeTimezoneFromDate(startOfToday()))}`,
      );

    for (const [date, payments] of Object.entries(paymentsByDate)) {
      const mergedNotifications = payments
        .map(
          (payment) =>
            `- ${payment.name}\n  - ${payment.client.name}\n  - ${formatCurrency(Number(payment.amount))}`,
        )
        .join("\n");

      notification.addField(
        formatDate(new Date(date)),
        mergedNotifications,
        false,
      );
    }

    await sendDiscordNotification(notification);
  },
  start: true,
  timeZone: "UTC",
};

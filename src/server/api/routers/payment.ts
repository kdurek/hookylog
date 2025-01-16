import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PaymentSchedule, PaymentStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { addMonths, addYears, startOfToday } from "date-fns";
import { removeTimezoneFromDate } from "@/lib/utils";

export const paymentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const payments = await ctx.db.payment.findMany({
      include: {
        client: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return payments;
  }),

  getUnpaid: protectedProcedure.query(async ({ ctx }) => {
    const payments = await ctx.db.payment.findMany({
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
    return payments;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        clientId: z.string().cuid(),
        date: z.date(),
        schedule: z.nativeEnum(PaymentSchedule),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.payment.create({
        data: {
          name: input.name,
          clientId: input.clientId,
          date: input.date,
          schedule: input.schedule,
          amount: input.amount,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string(),
        clientId: z.string().cuid(),
        date: z.date(),
        schedule: z.nativeEnum(PaymentSchedule),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.payment.update({
        where: { id: input.id },
        data: {
          name: input.name,
          clientId: input.clientId,
          date: input.date,
          schedule: input.schedule,
          amount: input.amount,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.payment.delete({
        where: { id: input.id },
      });
    }),

  setAsPaid: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentPayment = await ctx.db.payment.findUnique({
        where: { id: input.id },
      });

      if (currentPayment?.status === PaymentStatus.PAID) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payment is already paid",
        });
      }

      const paidPayment = await ctx.db.payment.update({
        where: { id: input.id },
        data: {
          status: PaymentStatus.PAID,
        },
      });

      const newDateBasedOnSchedule = (
        date: Date,
        schedule: PaymentSchedule,
      ) => {
        switch (schedule) {
          case PaymentSchedule.MONTHLY:
            return addMonths(date, 1);
          case PaymentSchedule.YEARLY:
            return addYears(date, 1);
        }
      };

      const newDate = newDateBasedOnSchedule(
        paidPayment.date,
        paidPayment.schedule,
      );

      if (!newDate) {
        return paidPayment;
      }

      return ctx.db.payment.create({
        data: {
          name: input.name,
          clientId: paidPayment.clientId,
          date: newDate,
          schedule: paidPayment.schedule,
          amount: paidPayment.amount,
        },
      });
    }),
});

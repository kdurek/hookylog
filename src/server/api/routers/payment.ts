import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { PaymentSchedule } from "@prisma/client";

export const paymentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const payments = await ctx.db.payment.findMany({
      include: {
        client: true,
      },
    });
    return payments;
  }),

  create: publicProcedure
    .input(
      z.object({
        clientId: z.string().cuid(),
        date: z.date(),
        schedule: z.nativeEnum(PaymentSchedule),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.payment.create({
        data: {
          clientId: input.clientId,
          date: input.date,
          schedule: input.schedule,
          amount: input.amount,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
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
          clientId: input.clientId,
          date: input.date,
          schedule: input.schedule,
          amount: input.amount,
        },
      });
    }),

  delete: publicProcedure
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
});

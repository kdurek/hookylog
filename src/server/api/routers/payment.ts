import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.payment.create({
        data: {
          clientId: input.clientId,
          amount: input.amount,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        clientId: z.string().cuid(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.payment.update({
        where: { id: input.id },
        data: {
          clientId: input.clientId,
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

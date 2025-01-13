import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const clientRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const clients = await ctx.db.client.findMany();
    return clients;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        company: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.create({
        data: {
          name: input.name,
          company: input.company,
          email: input.email,
          phone: input.phone,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string(),
        company: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.update({
        where: { id: input.id },
        data: {
          name: input.name,
          company: input.company,
          email: input.email,
          phone: input.phone,
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
      return ctx.db.client.delete({
        where: { id: input.id },
      });
    }),
});

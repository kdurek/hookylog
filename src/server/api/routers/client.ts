import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const clientRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const clients = await ctx.db.client.findMany();
    return clients;
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.create({
        data: {
          name: input.name,
          email: input.email,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
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
      return ctx.db.client.delete({
        where: { id: input.id },
      });
    }),
});

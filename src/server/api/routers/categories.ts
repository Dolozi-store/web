import { removeAccents } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const categoriesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (
        await createClient()
      )
        .from('Category')
        .insert({
          created_by: ctx.user.id,
          name: input.name,
          description: input.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (result.error) {
        console.error('Error creating category', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (
        await createClient()
      )
        .from('Category')
        .update({
          name: input.name,
          description: input.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .eq('created_by', ctx.user.id)
        .select()
        .single();

      if (result.error) {
        console.error('Error updating category', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return result.data;
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search, page, limit } = input;
      const offset = (page - 1) * limit;

      let query = (await createClient())
        .from('Category')
        .select('*', { count: 'exact' })
        .eq('created_by', ctx.user.id);

      if (search) {
        query = query.ilike('name', `%${removeAccents(search)}%`);
      }

      const result = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (result.error) {
        console.error('Error fetching categories:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return {
        data: result.data ?? [],
        metadata: {
          total: result.count ?? 0,
          page,
          limit,
          totalPages: Math.ceil((result.count ?? 0) / limit),
        },
      };
    }),
  getCategoryById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      console.log({ input });
      const result = await (await createClient())
        .from('Category')
        .select('*')
        .eq('id', input.id)
        .eq('created_by', ctx.user.id)
        .single();

      if (result.error) {
        console.error('Error fetching category:', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      if (!result.data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return result.data;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await (await createClient())
        .from('Category')
        .delete()
        .eq('id', input.id)
        .eq('created_by', ctx.user.id);

      if (result.error) {
        console.error('Error updating category', result.error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        });
      }

      return {
        message: 'Deleting category successfully',
      };
    }),
});

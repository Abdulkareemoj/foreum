import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { customPage } from '~/server/db/schema/custom-page-schema';
import { adminProcedure, publicProcedure, router } from '~/server/trpc/init';

export const pagesRouter = router({
	list: adminProcedure.query(async () => {
		return await db.select().from(customPage).orderBy(customPage.createdAt);
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const [page] = await db
				.select()
				.from(customPage)
				.where(eq(customPage.slug, input.slug));
			return page || null;
		}),

	create: adminProcedure
		.input(z.object({ title: z.string(), slug: z.string(), content: z.string() }))
		.mutation(async ({ input }) => {
			const [page] = await db
				.insert(customPage)
				.values({ title: input.title, slug: input.slug, content: input.content })
				.returning();
			return page;
		}),

	update: adminProcedure
		.input(z.object({ id: z.string(), title: z.string(), slug: z.string(), content: z.string(), published: z.boolean() }))
		.mutation(async ({ input }) => {
			const [page] = await db
				.update(customPage)
				.set({ title: input.title, slug: input.slug, content: input.content, published: input.published, updatedAt: new Date() })
				.where(eq(customPage.id, input.id))
				.returning();
			return page;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			await db.delete(customPage).where(eq(customPage.id, input.id));
			return { success: true };
		}),
});

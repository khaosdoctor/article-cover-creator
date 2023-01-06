import { z } from 'x/zod@v3.20.2/mod.ts';

export const getBlogArticleQueryStringSchema = z.object({
	title: z.string().min(1).max(100),
	image: z.string().url(),
	fontSize: z.string().default('86pt'),
	marginLeft: z.string().default('75px'),
	marginTop: z.string().default('85px'),
	widthLimit: z.string().default('65%'),
	noFit: z.string().optional(),
});

export type GetBlogArticleQueryStringSchemaType = z.infer<typeof getBlogArticleQueryStringSchema>;

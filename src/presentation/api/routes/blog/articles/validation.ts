import { z } from 'zod';

export const getBlogArticleQueryStringSchema = (canvasSize: number[]) => z.object({
	title: z.string().min(1).max(100),
	image: z.string().url().transform((image: string) => {
		const parsedImageURL = new URL(image);
		return `${parsedImageURL.origin}${parsedImageURL.pathname}?fit=crop&auto=format&q=60&w=${
			canvasSize[0]
		}&h=${canvasSize[1]}&fm=jpg`
	}),
	fontSize: z.string().default('140'),
	marginLeft: z.string().default('75px'),
	marginTop: z.string().default('25px'),
	widthLimit: z.string().default('80%'),
	debug: z.string().optional(),
});

export type GetBlogArticleQueryStringSchemaType = z.infer<ReturnType<typeof getBlogArticleQueryStringSchema>>;

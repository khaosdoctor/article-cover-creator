import { z } from 'zod';

export enum Templates {
  SQUARE = 'square',
  LANDSCAPE = 'landscape',
}

export const CanvasSizes = new Map<Templates, number[]>([
  [Templates.SQUARE, [1080, 1080]],
  [Templates.LANDSCAPE, [1440, 732]],
]);

export const getBlogArticleQueryStringSchema = () =>
  z.object({
    title: z.string().min(1).max(100),
    image: z.string().url().transform((image) => {
      const parsedImageURL = new URL(image);
      return (canvasSize: number[]) =>
        `${parsedImageURL.origin}${parsedImageURL.pathname}?fit=crop&auto=format&q=60&w=${
          canvasSize[0]
        }&h=${canvasSize[1]}&fm=jpg`;
    }),
    fontSize: z.string().default('140'),
    debug: z.coerce.boolean().optional(),
    raw: z.coerce.boolean().optional(),
    template: z.nativeEnum(Templates).default(Templates.LANDSCAPE),
  });

export type GetBlogArticleQueryStringSchemaType = z.infer<
  ReturnType<typeof getBlogArticleQueryStringSchema>
>;

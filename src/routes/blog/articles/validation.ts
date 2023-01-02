import { z } from 'x/zod@v3.20.2/mod.ts'

export const getBlogArticleQueryStringSchema = z.object({
  title: z.string().min(1).max(100),
  backgroundImage: z.string().url()
})

export type GetBlogArticleQueryStringSchemaType = z.infer<typeof getBlogArticleQueryStringSchema>

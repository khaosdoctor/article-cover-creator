import { Application, Router } from 'oak/mod.ts'
import { oakCors } from 'x/cors@v1.2.2/mod.ts'
import { loadConfig } from './config.ts'
import { getBlogArticleQueryStringSchema } from './routes/blog/articles/validation.ts'
import { errorMapper } from "./utils/errorMapper.ts"

const config = await loadConfig()
const router = new Router()
const cors = oakCors({
  origin: config.isLocal ? true : /^.+lsantos.dev$/,
})

router.options('/blog/articles', cors)
router.get('/blog/articles', async (ctx) => {
  const queryString = Object.fromEntries(ctx.request.url.searchParams.entries())
  const parsedQueryString = await getBlogArticleQueryStringSchema.parseAsync(queryString)

})

const app = new Application()
app.use(cors)

// Error Handler
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const { status, body } = errorMapper(error, config.isLocal)
    ctx.response.status = status
    ctx.response.body = body
    ctx.response.type = 'json'
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Server running on port ${config.port}`)
await app.listen({ port: config.port })

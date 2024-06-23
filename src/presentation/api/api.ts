import { Application, Router } from '@oak/oak'
import { fromFileUrl, resolve } from '@std/path'
import { cacheFactory } from '../../actions/cacheFactory.ts'
import { createImageFromHTML } from '../../actions/createImageFromHtml.tsx'
import { appConfig as config } from '../../config.ts'
import { articleTemplate } from '../../templates/article.tsx'
import { getBlogArticleQueryStringSchema } from './routes/blog/articles/validation.ts'
import { errorMapper } from './utils/errorMapper.ts'
import { sendImageResponse } from './utils/respondWithImage.ts'
import { withDebug } from './utils/runWithDebug.ts'
import DOMServer from 'reactDOM'

const router = new Router();
const cache = await cacheFactory()
// Import fonts
const fontData =
	await Deno.readFile(
		resolve(fromFileUrl(import.meta.url), '../../../templates/fonts/AllerDisplay.ttf'),
	)

router.get('/blog/articles', async (ctx) => {
	const cached = await cache.match(ctx.request.url)
	if (cached) {
		return sendImageResponse(ctx, cached, cache, { fromCache: true })
	}

	const canvasSize = [1440, 732];
	const queryString = Object.fromEntries(ctx.request.url.searchParams.entries());
	const { debug, raw, ...parsedQueryString } = await getBlogArticleQueryStringSchema(canvasSize).parseAsync(
		queryString,
	);



	// create template
	const [template, templateElapsed] = await withDebug(
		async () => await articleTemplate({ ...parsedQueryString }, raw),
		!!debug,
	);

	// debug flag to return the raw template as html
	if (raw) {
		ctx.response.type = 'html'
		ctx.response.body = DOMServer.renderToStaticMarkup(template as any)
		return ctx
	}

	const [image, imageElapsed] = await withDebug(
		async () => await createImageFromHTML(template, fontData, canvasSize[0], canvasSize[1]),
		!!debug,
	);
	const debugHeaders = debug ? { templateElapsed, imageElapsed } : undefined

	sendImageResponse(ctx, image, cache, debugHeaders);
});

const app = new Application();
// Error Handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (error) {
		const { status, body } = errorMapper(error, config.isDev);
		ctx.response.status = status;
		ctx.response.body = body;
		ctx.response.type = 'json';
	}
});
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server listening on port ${config.port}`);
await app.listen({ port: config.port });

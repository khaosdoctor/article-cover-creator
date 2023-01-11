import { fromFileUrl, resolve } from 'std/path/mod.ts';
import { Application, Router } from 'x/oak@v11.1.0/mod.ts';
import { createImageFromHTML } from '../../actions/createImageFromHtml.tsx';
import { loadConfig } from '../../config.ts';
import { withDebug } from './utils/runWithDebug.ts';
import { errorMapper } from './utils/errorMapper.ts';
import { sendImageResponse } from './utils/respondWithImage.ts';
import { articleTemplate, TemplateParams } from '../../templates/article.tsx';
import { getBlogArticleQueryStringSchema } from './routes/blog/articles/validation.ts';

const config = await loadConfig();
const router = new Router();
router.get('/blog/articles', async (ctx) => {
	const canvasSize = [1440, 732];
	const queryString = Object.fromEntries(ctx.request.url.searchParams.entries());
	const { debug, ...parsedQueryString } = await getBlogArticleQueryStringSchema(canvasSize).parseAsync(
		queryString,
	);

	const templateParams: TemplateParams = {
		...parsedQueryString,
	};

	const [fontData, fontElapsed] = await withDebug(async () =>
		await Deno.readFile(
			resolve(fromFileUrl(import.meta.url), '../../../templates/fonts/AllerDisplay.ttf'),
		), !!debug);
	const [template, templateElapsed] = await withDebug(
		async () => await articleTemplate(templateParams),
		!!debug,
	);
	const [image, imageElapsed] = await withDebug(
		async () => await createImageFromHTML(template, fontData, canvasSize[0], canvasSize[1]),
		!!debug,
	);

	sendImageResponse(ctx, image, debug ? { fontElapsed, templateElapsed, imageElapsed } : undefined);
});

const app = new Application();
// Error Handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (error) {
		const { status, body } = errorMapper(error, config.isLocal);
		ctx.response.status = status;
		ctx.response.body = body;
		ctx.response.type = 'json';
	}
});
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server listening on port ${config.port}`);
await app.listen({ port: config.port });

#!/usr/bin/env DENO_DIR=/tmp deno run --allow-net --allow-read --allow-write --allow-env --unstable
import { render } from 'https://esm.sh/ejs@3.1.8';
import { Application, Router } from 'x/oak@v11.1.0/mod.ts';
import { loadConfig } from '../../config.ts';
import { cacheFactory } from '../../actions/cacheFactory.ts';
import { createImageFromHTML } from '../../actions/createImageFromHtml.ts';
import { sendImageResponse } from './utils/respondWithImage.ts';
import { getBlogArticleQueryStringSchema } from './routes/blog/articles/validation.ts';
import { errorMapper } from './utils/errorMapper.ts';
import { importTemplate } from '../../actions/importTemplate.ts';
import { addSignalListeners } from '../../utils/addSignalListeners.ts';
import { initializeBrowser } from '../../actions/initBrowser.ts';

const browser = await initializeBrowser();
const config = await loadConfig();
const ejsTemplate = await importTemplate();
const articleCache = await cacheFactory('article-cache');

addSignalListeners(browser);

const router = new Router();
router.get('/blog/articles', async (ctx) => {
	const cachedImage = await articleCache.match(ctx.request.url);
	if (cachedImage) {
		console.log(`Cache hit for ${ctx.request.url}`);
		const image = await cachedImage.arrayBuffer();
		return sendImageResponse(ctx, new Uint8Array(image) as Buffer);
	}

	console.log(`Cache miss for ${ctx.request.url}, saving...`);
	const queryString = Object.fromEntries(ctx.request.url.searchParams.entries());
	const parsedQueryString = await getBlogArticleQueryStringSchema.parseAsync(queryString);
	const templateParams = { ...parsedQueryString, autoFit: !!parsedQueryString.noFit ?? true };

	const parsedTemplateString = render(ejsTemplate, templateParams);
	const image = await createImageFromHTML(browser, parsedTemplateString) as Buffer;

	articleCache.put(
		ctx.request.url,
		new Response(image, { headers: { 'Content-Type': 'image/png' } }),
	);

	sendImageResponse(ctx, image);
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

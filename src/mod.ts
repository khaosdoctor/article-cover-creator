import { render } from 'https://esm.sh/ejs@3.1.8';
import { fromFileUrl, resolve } from 'std/path/mod.ts'
import { Application, Router } from 'x/oak@v11.1.0/mod.ts';
import puppeeteer, { Browser } from 'x/puppeteer@16.2.0/mod.ts';
import { loadConfig } from './config.ts';
import { createImageFromHTML } from './controllers/createImageFromHtml.ts';
import { sendImageResponse } from './routes/blog/articles/respondWithImage.ts';
import { getBlogArticleQueryStringSchema } from './routes/blog/articles/validation.ts';
import { errorMapper } from './utils/errorMapper.ts';
const log = (message: string) => Deno.stdout.write(new TextEncoder().encode(`${message}\n`));
const config = await loadConfig();

let ejsTemplate: string;
let browser: Browser;
const articleCache = await caches.open('blog-articles');

const gracefulShutdown = async () => {
	console.log(`Shutting down...`);
	await browser.close();
	Deno.exit(0);
};
Deno.addSignalListener('SIGINT', gracefulShutdown);
Deno.addSignalListener('SIGTERM', gracefulShutdown);

try {
	log(`Launching browser...`);
	browser = await puppeeteer.launch({ headless: true });
} catch (error) {
	console.error(`Error launching browser: ${error}`);
	Deno.exit(1);
}

try {
	log(`Importing template...`);
	const __dirname = resolve(fromFileUrl(import.meta.url), '..');
	const ejsTemplateBuffer = await Deno.readFile(resolve(__dirname, './templates/article.ejs'));
	ejsTemplate = new TextDecoder().decode(ejsTemplateBuffer);
	log(`Template imported successfully`);
} catch (err) {
	console.error(`Error importing template: ${err}`);
	Deno.exit(1);
}

const router = new Router();

router.get('/blog/articles', async (ctx) => {
	const cachedImage = await articleCache.match(ctx.request.url);
	if (cachedImage) {
		log(`Cache hit for ${ctx.request.url}\n`);
		const image = await cachedImage.arrayBuffer();
		return sendImageResponse(ctx, new Uint8Array(image) as Buffer);
	}

	log(`Cache miss for ${ctx.request.url}, saving...`);
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

log(`Server running on port ${config.port}`);
await app.listen({ port: config.port });

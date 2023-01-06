import { RouterContext } from 'x/oak@v11.1.0/mod.ts';

export const sendImageResponse = (
	ctx: RouterContext<
		'/blog/articles',
		Record<string | number, string | undefined>,
		Record<string, any>
	>,
	image: Buffer,
) => {
	ctx.response.headers.set('Content-Type', 'image/png');
	ctx.response.headers.set('Content-Length', image.length.toString());
	ctx.response.body = image;
	return ctx;
};
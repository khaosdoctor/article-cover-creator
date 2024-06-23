import { RouterContext } from '@oak/oak';
import { ImageCache } from '../../../actions/cacheFactory.ts';

export const sendImageResponse = (
	ctx: RouterContext<
		'/blog/articles',
		Record<string | number, string | undefined>,
		Record<string, any>
	>,
	image: Uint8Array | ArrayBuffer,
	cache: ImageCache,
	debugData?: Record<string, any>,
) => {
	ctx.response.headers.set('Content-Type', 'image/png');
	ctx.response.headers.set('Content-Length', image.byteLength.toString());
	ctx.response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	if (debugData) {
		for (const [header, value] of Object.entries(debugData)) {
			ctx.response.headers.set(`x-debug-${header}-ms`, value);
		}
	}
	ctx.response.body = image;

	cache.put(ctx.request.url, image)
	return ctx
};

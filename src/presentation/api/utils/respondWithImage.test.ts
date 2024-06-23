import { assertEquals } from '@std/assert';
import { sendImageResponse } from './respondWithImage.ts';
import { Buffer } from '@std/io/buffer';

Deno.test('sendImageResponse sets the correct headers and body with no debug tags', () => {
	const ctx: any = {
		request: {
			headers: new Headers(),
			method: 'GET',
			url: new URL('http://localhost:8080'),
		},
		response: {
			headers: new Headers(),
			status: 0,
			body: new Buffer(),
		},
	};

	const image = new TextEncoder().encode('test image');

	sendImageResponse(ctx, image);

	assertEquals(ctx.response.headers.get('Content-Type'), 'image/png');
	assertEquals(ctx.response.headers.get('Content-Length'), '10');
	assertEquals(ctx.response.body, image);
});

Deno.test('sendImageResponse sets the correct headers and body with debug tags', () => {
	const ctx: any = {
		request: {
			headers: new Headers(),
			method: 'GET',
			url: new URL('http://localhost:8080'),
		},
		response: {
			headers: new Headers(),
			status: 0,
			body: new Buffer(),
		},
	};

	const image = new TextEncoder().encode('test image');

	sendImageResponse(ctx, image, { 'test-header': 100 });

	assertEquals(ctx.response.headers.get('Content-Type'), 'image/png');
	assertEquals(ctx.response.headers.get('Content-Length'), '10');
	assertEquals(ctx.response.headers.get('x-debug-test-header-ms'), '100');
	assertEquals(ctx.response.body, image);
});

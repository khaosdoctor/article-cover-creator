import { assertEquals } from 'std/testing/asserts.ts'
import { sendImageResponse } from './respondWithImage.ts'
import { Buffer } from 'std/io/buffer.ts'

Deno.test('sendImageResponse sets the correct headers and body', () => {
  const ctx: any
    = {
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
  }

  const image = new Buffer(new TextEncoder().encode('test image'))

  sendImageResponse(ctx, image)

  assertEquals(ctx.response.headers.get('Content-Type'), 'image/png')
  assertEquals(ctx.response.headers.get('Content-Length'), '10')
  assertEquals(ctx.response.body, image)
})

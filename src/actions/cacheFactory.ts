import { encodeBase64 } from '@std/encoding/base64'
import { dirname, fromFileUrl, join, resolve } from '@std/path'
import { appConfig } from '../config.ts'

type CacheValue = ArrayBuffer

export class ImageCache {
	static instance: Map<string, ImageCache> = new Map()

	constructor(private readonly name: string, private readonly Kv: Deno.Kv) {
		if (ImageCache.instance.get(name) !== undefined) {
			return ImageCache.instance.get(name)!
		}
		ImageCache.instance.set(name, this)
	}

	async match(url: URL): Promise<ArrayBuffer | null> {
		const response = await this.Kv.get<Uint8Array>(['cache', this.name, encodeBase64(url.toString())]);
		Deno.stdout.write(new TextEncoder().encode(`[CACHE] Matching ${url} :: version: ${response.versionstamp ?? 'not found'}\n`))

		return response.value
	}

	async put(url: URL, image: CacheValue) {
		if (image.byteLength > 65535) {
			console.log(`[DEBUG] Image too large :: ${(image.byteLength/1024).toFixed(0)}kb (max: 64kb) skipping cache`)
			return { ok: false, versionstamp: "0" }
		}

		const FIVE_DAYS = 60 * 60 * 24 * 5;
		const result = await this.Kv.set(['cache', this.name, encodeBase64(url.toString())], image, {expireIn: FIVE_DAYS })
		Deno.stdout.write(new TextEncoder().encode(`[CACHE] Putting ${url} :: result => ${result.ok} (v: ${result.versionstamp})\n`))
		return result
	}
}

export async function cacheFactory (cacheName: string = 'responseCache') {
	const __dirname = dirname(fromFileUrl(import.meta.url));
	const kvPath = appConfig.isDev ? resolve(join(__dirname,'../../.local_kv')) : undefined
	Deno.stdout.write(new TextEncoder().encode(`Initializing cache named "${cacheName}" at ${kvPath ?? 'Deno Hosted Path'}`))
	const KV = await Deno.openKv(kvPath)
	return new ImageCache(cacheName, KV)
};

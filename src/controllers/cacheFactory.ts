class Cache {
  private internalCache: Map<string, Response> = new Map()
  constructor (private readonly name: string) { }

  match (url: URL) {
    return Promise.resolve(this.internalCache.get(url.toString()))
  }

  put (url: URL, response: Response) {
    this.internalCache.set(url.toString(), response)
    return Promise.resolve()
  }
}

export const cacheFactory = (cacheName: string) => {
  if (globalThis.caches !== undefined) {
    return globalThis.caches.open(cacheName)
  }

  return Promise.resolve(new Cache(cacheName))
}

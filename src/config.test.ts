import { assertEquals } from "std/testing/asserts.ts"
import { stub } from 'std/testing/mock.ts'
import { AppConfig, loadConfig } from './config.ts'

const envStub = stub(Deno.env, 'get', (_key: string) => '/home/user')

Deno.test('loadConfig returns the expected config', async () => {
  const expectedConfig: AppConfig = {
    port: 3000,
    isLocal: false,
    cacheDir: '/home/user/.cache/cover-gen',
  }

  const actualConfig = await loadConfig()

  assertEquals(actualConfig, expectedConfig)
  envStub.restore()
})

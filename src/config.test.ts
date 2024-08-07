
import { assertEquals } from '@std/assert';
import { stub } from '@std/testing/mock';
import { AppConfig, loadConfig } from './config.ts';

const envStub = stub(Deno.env, 'get', (_key: string) => '/home/user');

Deno.test('loadConfig returns the expected config', async () => {
	const expectedConfig: AppConfig = {
		port: 3000,
		isDev: false
	};

	const actualConfig = await loadConfig();

	assertEquals(actualConfig, expectedConfig);
	envStub.restore();
});

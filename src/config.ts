import { load } from '@std/dotenv';
import { z } from 'zod';
const loadedConfig = await load({export: true}) as unknown as rawEnv

const configSchema = z.object({
	port: z.coerce.number().min(1024).max(65535).default(3000),
	isDev: z.boolean().optional().default(Deno.env.get('DENO_ENV') as string !== 'production')
})
export type AppConfig = z.infer<typeof configSchema>

type rawEnv = {
	[envName in Uppercase<Extract<keyof AppConfig, string>> | Exclude<keyof AppConfig, string>]:
		string;
};

export const appConfig = configSchema.parse(loadedConfig)

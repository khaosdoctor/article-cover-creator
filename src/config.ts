import { load } from 'std/dotenv/mod.ts';

export interface AppConfig {
	port: number;
	isLocal: boolean;
}

type rawEnv = {
	[envName in Uppercase<Extract<keyof AppConfig, string>> | Exclude<keyof AppConfig, string>]:
		string;
};

export const loadConfig = async (): Promise<AppConfig> => {
	Deno.stdout.write(new TextEncoder().encode('Loading config...\n'));
	const loadedEnvs = await load({ export: true }) as unknown as rawEnv;
	Deno.stdout.write(new TextEncoder().encode('Config Loaded...\n'));

	return {
		port: Number(loadedEnvs.PORT),
		isLocal: Deno.env.get('DENO_ENV') as string === 'local',
	};
};

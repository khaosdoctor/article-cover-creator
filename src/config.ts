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
	const loadedEnvs = await load({ export: true }) as unknown as rawEnv;

	return {
		port: Number(loadedEnvs.PORT),
		isLocal: Deno.env.get('DENO_ENV') as string === 'local',
	};
};

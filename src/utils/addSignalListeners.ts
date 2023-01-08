import { Browser } from 'x/puppeteer@16.2.0/mod.ts';

export const addSignalListeners = (browser: Browser) => {
	const gracefulShutdown = async () => {
		console.log(`Shutting down...`);
		await browser.close();
		Deno.exit(0);
	};
	Deno.addSignalListener('SIGINT', gracefulShutdown);
	Deno.addSignalListener('SIGTERM', gracefulShutdown);
};

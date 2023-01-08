import { fromFileUrl, resolve } from 'std/path/mod.ts';

export const importTemplate = async () => {
	try {
		console.log(`Importing template...`);
		const __dirname = resolve(fromFileUrl(import.meta.url), '..');
		const ejsTemplateBuffer = await Deno.readFile(resolve(__dirname, '../templates/article.ejs'));
		return new TextDecoder().decode(ejsTemplateBuffer);
	} catch (err) {
		console.error(`Error importing template: ${err}`);
		Deno.exit(1);
	}
};

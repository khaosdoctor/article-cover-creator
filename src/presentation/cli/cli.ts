import { render } from 'https://esm.sh/ejs@3.1.8';
import { crypto, toHashString } from 'std/crypto/mod.ts';
import { parse } from 'std/flags/mod.ts';
import { fg } from 'x/colorify@1.0.5/mod.ts';
import { ZodError } from 'x/zod@v3.20.2/mod.ts';
import { createImageFromHTML } from '../../actions/createImageFromHtml.ts';
import { importTemplate } from '../../actions/importTemplate.ts';
import { loadConfig } from '../../config.ts';
import { cliFlagsSchema } from './validation.ts';

const config = await loadConfig();

function printHelp() {
	console.log(`Create a blog article image with a title and a background image.

  Usage: cover-gen [flags] -o <path>
  Flags:
    --output, -o <path>     The output file name (required)
    --image <url>           The image to use as the background (required)
    --title <string>        The title of the blog article (required)
    --fontSize [string]     The font size of the title  (default: 86pt)
    --marginLeft [string]   The margin left of the title  (default: 75px)
    --marginTop [string]    The margin top of the title  (default: 85px)
    --widthLimit [string]   The width limit of the title  (default: 65%)
    --autoFit               Enable/Disable auto fit text to the image  (default: true)
    --force, -f             Force the image to be generated even if it's cached  (default: false)
`);
}

function returnImage(image: Uint8Array, flags: cliFlagsSchema) {
	if (flags.output || flags.o) {
		const path = flags.output || flags.o as string;
		fg.green(`📷 Saving image to ${path}...`);
		Deno.writeFile(path, image, { create: true });
	}

	Deno.exit(0);
}

async function main(args: string[]) {
	const { _: [command], ...flags } = parse(args);
	if (command || Object.keys(flags).length === 0 || flags.help) {
		return printHelp();
	}

	try {
		const parsedFlags: cliFlagsSchema = await cliFlagsSchema.parseAsync(flags);

		if (!flags.output && !flags.o) {
			fg.yellow('🤔 No output flag specified. Please specify --output or -o.');
			Deno.exit(1);
		}

		const uniqueHash = toHashString(
			await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(parsedFlags))),
			'hex',
		);

		if (!parsedFlags.force && !parsedFlags.f) {
			fg.blue('🔍 Looking for cached image...');
			await Deno.mkdir(config.cacheDir, { recursive: true });

			try {
				const cachedImage = await Deno.readFile(`${config.cacheDir}/${uniqueHash}`);
				fg.green('📸 Found cached image.');
				return returnImage(cachedImage, parsedFlags);
			} catch (err) {
				if (err instanceof Deno.errors.NotFound) {
					fg.yellow('🔍 No cached image found.');
				} else {
					throw err;
				}
			}
		}

		fg.yellow('🎨 Importing template...');
		const template = await importTemplate();

		fg.yellow('Generating image...');
		const parsedTemplate = render(template, parsedFlags);

		fg.blue('🌎 Initializing browser...');
		const browser = await initializeBrowser();

		fg.yellow('📺 Rendering...');
		const image = new Uint8Array(await createImageFromHTML(browser, parsedTemplate));

		fg.blue('📸 Caching image...');
		Deno.writeFile(`${config.cacheDir}/${uniqueHash}`, image, { create: true });

		return returnImage(image, parsedFlags);
	} catch (err) {
		if (err instanceof ZodError) {
			console.error(fg.red('Error parsing flags:'), (err as ZodError).issues[0].message);
			console.error(fg.yellow('Flags:'), (err as ZodError).issues[0].path);
		} else {
			console.error(fg.red('Error:'), err);
		}
		Deno.exit(1);
	}
}

main(Deno.args);

import { Templates } from '../presentation/api/routes/blog/articles/validation.ts';
import type { LandscapeTemplateParams } from './landscape.tsx';
import type { SquareTemplateParams } from './square.tsx';

export type TemplateFactory<P = any> = (params: P, raw: boolean) => Promise<JSX.Element>;

export async function generateTemplate<T extends Templates>(
  template: T,
  params: T extends Templates.LANDSCAPE ? LandscapeTemplateParams : SquareTemplateParams,
  raw: boolean = false,
) {
  console.log(`Generating template ${template}`);
  console.table(params);

  // Import based on the template name
  // This is not very type safe but it's easier to implement new templates
  const generator: TemplateFactory = (await import(`./${template}.tsx`)).default;
  if (!generator) {
    throw new Error(`Template ${template} not found`);
  }
  return generator(params, raw);
}


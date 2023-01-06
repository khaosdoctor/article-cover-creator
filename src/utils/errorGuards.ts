import { ZodError } from 'x/zod@v3.20.2/mod.ts';

export const isZodError = (error: unknown): error is ZodError => {
	return error instanceof ZodError;
};

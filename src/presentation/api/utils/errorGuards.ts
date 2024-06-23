import { ZodError } from 'zod';

export const isZodError = (error: unknown): error is ZodError => {
	return error instanceof ZodError;
};

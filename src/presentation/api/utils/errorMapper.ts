import { HttpError } from 'x/oak@v11.1.0/mod.ts';
import { ZodError, ZodInvalidTypeIssue } from 'x/zod@v3.20.2/mod.ts';

type ErrorMapperFn = (incomingError: any, isLocal: boolean) => {
	status: number;
	body: {
		message: string;
		details?: any;
		stack?: string;
	};
};

interface ErrorMapper {
	[key: string]: ErrorMapperFn;
}

const map: ErrorMapper = {
	ZodError: (err: ZodError<ZodInvalidTypeIssue>, isLocal) => ({
		status: 422,
		body: {
			message: 'Validation Error',
			details: err.issues.map((i) => ({
				fieldPath: i.path,
				message: i.message,
				code: i.code,
			})),
			...(isLocal ? { stack: err.stack } : {}),
		},
	}),
	HttpError: (err: HttpError, isLocal) => ({
		status: err.status,
		body: {
			message: err.message,
			...(isLocal ? { stack: err.stack } : {}),
		},
	}),
	default: (err: Error, isLocal) => ({
		status: 500,
		body: {
			message: 'Internal Server Error',
			details: err.message,
			...(isLocal ? { stack: err.stack } : {}),
		},
	}),
};

export const errorMapper = <T extends Error>(incomingError: T, isLocal: boolean) => {
	return map[incomingError.constructor.name]?.(incomingError, isLocal) ||
		map.default(incomingError, isLocal);
};

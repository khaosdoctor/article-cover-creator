export async function withDebug<T>(
	fn: (...args: any) => Promise<T>,
	debugFlag: boolean,
): Promise<[T, string | null]> {
	if (debugFlag) {
		const t0 = performance.now();
		const result = await fn();
		const t1 = performance.now();
		return [result, Number(t1 - t0).toFixed(6)];
	}
	return [await fn(), null];
}

export async function withDebug<T>(
	fn: (...args: any) => Promise<T>,
	debugFlag: boolean,
): Promise<[T, number | null]> {
	if (debugFlag) {
		performance.mark('debugStart')
		const result = await fn();
		performance.mark('debugEnd')
		const {duration} = performance.measure('ETT:', 'debugStart', 'debugEnd')
		performance.clearMarks()
		performance.clearMeasures()
		Deno.stdout.write(new TextEncoder().encode(`[DEBUG] Ran "${fn.name}" with duration ${duration}ms\n`))
		return [result, duration];
	}
	return [await fn(), null];
}

function arrayEquals(a: unknown, b: unknown): boolean {
	return (
		Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((val, index) => val === b[index])
	)
}

export const looseEqual = (a: unknown, b: unknown) => {
	if (Array.isArray(a)) {
		return arrayEquals(a, b)
	}
	return a == b
}

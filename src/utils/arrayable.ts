type Arrayable<T> = T[] | T

export const dearrayable = <T>(arrayable: Arrayable<T>): T[] =>
	Array.isArray(arrayable) ? arrayable : [arrayable]

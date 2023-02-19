type Arrayable<T> = T[] | T

const dearrayable = <T>(arrayable: Arrayable<T>): T[] =>
	Array.isArray(arrayable) ? arrayable : [arrayable]

import { Token, TokenStream } from "../token"
import { looseEqual } from "../utils/equal"

export const skipSpaces = (
	tokenStream: TokenStream,
	{
		start = true,
		end = true,
		checker = (token: Token) => Token.type(token) !== "space",
	} = {},
) => {
	const left = tokenStream.findIndex(checker)
	const right = tokenStream.findLastIndex(checker)
	return tokenStream.slice(
		start ? left : 0,
		end ? right + 1 : tokenStream.length,
	)
}

export const startsWithToken = (
	tokenStream$: TokenStream,
	token: Token,
): TokenStream | void => {
	const tokenStream = Array.from(tokenStream$)
	const first = tokenStream.shift()
	if (looseEqual(first, token)) {
		return tokenStream
	}
}

export const deliminated = (
	tokenStream$: TokenStream,
	start: Token,
	end: Token,
): [result: TokenStream, rest: TokenStream] | void => {
	const tokenStream = skipSpaces(tokenStream$)
	if (looseEqual(tokenStream.shift(), start)) {
		let count = 0
		const result = [] as TokenStream
		const rest = [] as TokenStream
		for (const token of tokenStream) {
			if (count === -1) {
				rest.push(token)
			} else {
				if (looseEqual(token, start)) {
					count += 1
				} else if (looseEqual(token, end)) {
					if (count === 0) {
						count = -1
						continue
					} else {
						count -= 1
					}
				}
				result.push(token)
			}
		}
		return [result, rest]
	}
}

export const splitStream = (
	target: TokenStream,
	checker: (token: Token) => boolean,
): [left: TokenStream, right: TokenStream] => {
	let found = false
	const left = [] as TokenStream
	const right = [] as TokenStream
	for (const token of target) {
		if (found) {
			right.push(token)
		} else {
			if (checker(token)) {
				found = true
			} else {
				left.push(token)
			}
		}
	}
	return [left, right]
}

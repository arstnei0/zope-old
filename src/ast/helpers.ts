import { Token, TokenStream } from "../token"
import { looseEqual } from "../utils/equal"

export const skipSpaces = (
	tokenStream: TokenStream,
	{ start = true, end = true } = {},
) => {
	const result = [] as TokenStream
	let notSpace = false
	for (const token of tokenStream) {
		if (!(Token.type(token) === "space")) {
			notSpace = true
			result.push(token)
		} else if (notSpace) {
			if (!end) result.push(token)
		} else {
			if (!start) result.push(token)
		}
	}
	return result
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

export const delimited = (
	tokenStream$: TokenStream,
	start: Token,
	end: Token,
): [TokenStream, TokenStream] | void => {
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
		const reversedTokenStream = Array.from(tokenStream)
		reversedTokenStream.reverse()
		let nonreversedI = tokenStream.length
		for (const iStr in reversedTokenStream) {
			const i = parseInt(iStr)
			const token = reversedTokenStream[i]
			nonreversedI -= 1
			if (looseEqual(token, end)) {
				return [
					tokenStream.slice(0, nonreversedI),
					tokenStream.slice(nonreversedI + 1),
				]
			}
		}
	}
}

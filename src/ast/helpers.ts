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

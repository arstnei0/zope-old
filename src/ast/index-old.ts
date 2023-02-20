import { Brackets, Token, TokenStream } from "../token"
import {
	deliminated as deliminated,
	skipSpaces,
	startsWithToken,
} from "./helpers"
import { Parser, Node, Literal, Parsed } from "./types"

export const parseBlock = ((tokenStream) => {
	const blockTokenStream = deliminated(
		tokenStream,
		Token.bracket(Brackets["{"]),
		Token.bracket(Brackets["}"]),
	)
	if (blockTokenStream) {
		const blockNode: Node = {
			type: "block",
			body: parseAll(blockTokenStream[0]),
		}
		return [blockNode, blockTokenStream[1]]
	}
}) satisfies Parser

export const parseIf = ((tokenStream$) => {
	const tokenStream = skipSpaces(tokenStream$)
	const startsWithIf = startsWithToken(tokenStream, Token.keyword("if"))
	if (!startsWithIf) return

	const withParen = deliminated(
		startsWithIf,
		Token.bracket(Brackets["("]),
		Token.bracket(Brackets[")"]),
	)
	if (!withParen) return

	const condition = parseOne(withParen[0])
	if (!condition) return

	const withBlock = deliminated(
		withParen[1],
		Token.bracket(Brackets["{"]),
		Token.bracket(Brackets["}"]),
	)
	if (!withBlock) return

	const then = parseOne(withBlock[0])
	if (!then) return

	return [
		{ type: "if", condition: condition[0], then: then[0] },
		withBlock[1],
	]
}) satisfies Parser

export const parseCall = ((tokenStream$) => {
	const tokenStream = skipSpaces(tokenStream$)
	const identifier = tokenStream.shift()
	if (!identifier) return
	const callToken: Node = {
		type: "call",
		fn: undefined as unknown as Node,
		in: undefined as unknown as Node,
	}
	if (Token.type(identifier) === "identifier") {
		callToken.fn = {
			type: "read",
			identifier: Token.data(identifier),
		} as Node
		const withParen = deliminated(
			tokenStream,
			Token.bracket(Brackets["("]),
			Token.bracket(Brackets[")"]),
		)
		if (!withParen) return
		const input = parseOne(withParen[0])
		if (!input) return
		callToken.in = input[0]
		return [callToken, withParen[1]]
	}
}) as Parser

export const parseLiteral = ((tokenStream$) => {
	const tokenStream = skipSpaces(tokenStream$)
	const first = tokenStream[0]
	if (!first) return
	return Token.match(first, {
		keyword() {
			if (this === "true") {
				return [
					{ type: "literal", data: Literal.boolean(true) },
					[],
				] as Parsed
			} else if (this === "false") {
				return [
					{ type: "literal", data: Literal.boolean(true) },
					[],
				] as Parsed
			}
			return
		},
		number(number) {
			const float = +number.join("")
			return [
				{ type: "literal", data: Literal.number(float) } as Node,
				[],
			] as Parsed
		},
		_() {
			const withQuotation = deliminated(
				tokenStream,
				Token.separator('"'),
				Token.separator('"'),
			)
			if (withQuotation) {
				return [
					{
						type: "literal",
						data: Literal.string(
							Token.data(withQuotation[0][0]) as string,
						),
					},
					[],
				] as Parsed
			}
			return
		},
	})
}) satisfies Parser

export const parseLet = ((tokenStream$: TokenStream) => {
	const tokenStream = skipSpaces(tokenStream$)
	const first = tokenStream.shift()
	if (!first) return
	return Token.match(first, {
		keyword() {
			if (this === "let") {
				const second = tokenStream.shift()
				if (!second) return
				return Token.match(second, {
					space() {
						if (!(this === " ")) return
						const third = parseOne(tokenStream)
						if (!third) return
						return [{ type: "let", identifier }, third[1]] as Parsed
					},
					_() {
						return
					},
				})
			}
		},
		_() {
			return
		},
	})
}) satisfies Parser

export const parseOne = ((tokenStream: TokenStream) => {
	const blockNode = parseBlock(tokenStream)
	if (blockNode) return blockNode
	const ifNode = parseIf(tokenStream)
	if (ifNode) return ifNode
	const literalNode = parseLiteral(tokenStream)
	if (literalNode) return literalNode
	const callNode = parseCall(tokenStream)
	if (callNode) return callNode
}) as Parser

export const parseAll = (tokenStream: TokenStream): Node[] => {
	const result = parseOne(tokenStream)
	if (result) {
		return [result[0], ...(result[1] ? parseAll(result[1]) : [])]
	}
	return []
}

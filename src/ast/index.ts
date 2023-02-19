import { Brackets, Token, TokenStream } from "../token"
import { delimited, skipSpaces, startsWithToken } from "./helpers"
import { Parser, Node, Literal, Parsed } from "./types"

export const parseBlock = ((tokenStream) => {
	const blockTokenStream = delimited(
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

	const withParen = delimited(
		startsWithIf,
		Token.bracket(Brackets["("]),
		Token.bracket(Brackets[")"]),
	)
	if (!withParen) return

	const condition = parse(withParen[0])
	if (!condition) return

	const withBlock = delimited(
		withParen[1],
		Token.bracket(Brackets["{"]),
		Token.bracket(Brackets["}"]),
	)
	if (!withBlock) return

	const then = parse(withBlock[0])
	if (!then) return

	return [
		{ type: "if", condition: condition[0], then: then[0] },
		withBlock[1],
	]
}) satisfies Parser

export const parseLiteral = ((tokenStream$) => {
	const tokenStream = skipSpaces(tokenStream$)
	const first = tokenStream.pop()
	if (!first) return
	return Token.match(first, {
		identifier(identifier) {
			try {
				const float = parseFloat(identifier)
				return [
					{ type: "literal", data: Literal.number(float) } as Node,
					[],
				] as Parsed
			} catch (e) {
				tokenStream.unshift(first)
				const withQuotation = delimited(
					tokenStream,
					Token.identifier('"'),
					Token.identifier('"'),
				)
				if (withQuotation) {
					return {}
				}
				return
			}
		},
		_() {
			return
		},
	})
}) satisfies Parser

export const parse = ((tokenStream: TokenStream) => {
	const blockNode = parseBlock(tokenStream)
	if (blockNode) return blockNode
	const ifNode = parseIf(tokenStream)
	if (ifNode) return ifNode
}) as Parser

export const parseAll = (tokenStream: TokenStream): Node[] => {
	const result = parse(tokenStream)
	if (result) {
		return [result[0], ...(result[1] ? parseAll(result[1]) : [])]
	}
	return []
}

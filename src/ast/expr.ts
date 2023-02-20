import {
	AnySpaceChecker,
	BracketTokens,
	TokenType,
	TokenStream,
} from "../token"
import { skipSpaces, deliminated, splitStream } from "./helpers"
import { parseAllStmt as parseAllStmts } from "./stmt"
import {
	AccesserExpr,
	AssignExpr,
	BlockExpr,
	CallExpr,
	Expr,
	Literal,
	LiteralExpr,
} from "./types"

export type ParseExprResult<ExprType extends Expr = Expr> = {
	expr: ExprType
	rest: TokenStream
} | void

export type ParseLiteralExprResult = ParseExprResult<LiteralExpr>
export const parseLiteralExpr = (
	tokenStream$: TokenStream,
): ParseLiteralExprResult => {
	const tokenStream = skipSpaces(tokenStream$)
	if (tokenStream.length === 0) return
	const first = tokenStream.shift()
	if (!first) return
	return TokenType.match(first[1], {
		keyword() {
			if (this === "true") {
				return {
					expr: ["expr", "literal", Literal.boolean(true)],
					rest: tokenStream,
				} as ParseLiteralExprResult
			} else if (this === "false") {
				return {
					expr: ["expr", "literal", Literal.boolean(false)],
					rest: tokenStream,
				} as ParseLiteralExprResult
			}
		},
		number(number) {
			const float = +number.join("")
			return {
				expr: ["expr", "literal", Literal.number(float)],
				rest: tokenStream,
			}
		},
		_() {
			tokenStream.unshift(first)
			const withQuotation = deliminated(
				tokenStream,
				TokenType.separator('"'),
				TokenType.separator('"'),
			)
			if (withQuotation) {
				return {
					expr: [
						"expr",
						"literal",
						Literal.string(
							TokenType.data(withQuotation[0][0][1]) as string,
						),
					],
					rest: withQuotation[1],
				}
			}
		},
	})
}

export const parseAccesserExpr = (
	tokenStream$: TokenStream,
): ParseExprResult<AccesserExpr> => {
	const tokenStream = skipSpaces(tokenStream$)
	const first = tokenStream.shift()
	if (!first) return

	return TokenType.match<ParseExprResult<AccesserExpr>>(first[1], {
		identifier(ident) {
			const afterFirst = skipSpaces(tokenStream)
			const exprEnded = {
				expr: ["expr", "accesser", { idents: [ident] }],
				rest: Array.from(afterFirst),
			} as ParseExprResult<AccesserExpr>

			const next = afterFirst.shift()
			if (!next) return exprEnded

			return TokenType.match<ParseExprResult<AccesserExpr>>(next[1], {
				accesser() {
					const nextAccesser = parseAccesserExpr(afterFirst)
					if (nextAccesser) {
						return {
							expr: [
								"expr",
								"accesser",
								{
									idents: [
										ident,
										...nextAccesser.expr[2].idents,
									],
								},
							],
							rest: nextAccesser.rest,
						}
					} else return exprEnded
				},
				_: () => exprEnded,
			})
		},
		_() {},
	})
}

export const parseBlockExpr = (
	tokenStream$: TokenStream,
): ParseExprResult<BlockExpr> => {
	const tokenStream = skipSpaces(tokenStream$)
	const withCurlyBrackets = deliminated(
		tokenStream,
		BracketTokens["{"],
		BracketTokens["}"],
	)
	if (!withCurlyBrackets) return

	const stmts = parseAllStmts(withCurlyBrackets[0])

	return {
		expr: ["expr", "block", { stmts }],
		rest: withCurlyBrackets[1],
	}
}

export const parseAssignExpr = (
	tokenStream$: TokenStream,
): ParseExprResult<AssignExpr> => {
	const tokenStream = skipSpaces(tokenStream$)
	const accesser = parseAccesserExpr(tokenStream)
	if (!accesser) return

	const afterAccesser = skipSpaces(accesser.rest)
	const equalSign = afterAccesser.shift()
	if (!equalSign) return

	return TokenType.match<ParseExprResult<AssignExpr>>(equalSign, {
		operator() {
			if (this !== "=") return

			const afterEqualSign = skipSpaces(afterAccesser)
			const data = parseOneExpr(afterEqualSign)
			if (!data) return

			return {
				expr: [
					"expr",
					"assign",
					{ accesser: accesser.expr, data: data.expr },
				],
				rest: data.rest,
			}
		},
		_() {},
	})
}

export type ParseCallExprResult = ParseExprResult<CallExpr>
export const parseCallExpr = (
	tokenStream$: TokenStream,
): ParseCallExprResult => {
	const tokenStream = skipSpaces(tokenStream$)
	const withParen = deliminated(
		tokenStream,
		BracketTokens["("],
		BracketTokens[")"],
	)
	if (!withParen) return

	const splited = splitStream(withParen[0], AnySpaceChecker)
	if (!splited) return

	const [left, right] = splited
	if (!left || !right) return

	const [fn, input] = [parseOneExpr(left), parseOneExpr(right)]
	if (!fn || !input) return

	return {
		expr: ["expr", "call", { fn: fn.expr, input: input.expr }],
		rest: withParen[1],
	}
}

export const parseOneExpr = (tokenStream: TokenStream): ParseExprResult => {
	const literalExpr = parseLiteralExpr(tokenStream)
	if (literalExpr) return literalExpr
	const accesserExpr = parseAccesserExpr(tokenStream)
	if (accesserExpr) return accesserExpr
	const callExpr = parseCallExpr(tokenStream)
	if (callExpr) return callExpr
}

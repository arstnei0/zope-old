import { AnySpaceChecker, BracketTokens, Token, TokenStream } from "../token"
import { skipSpaces, deliminated, splitStream } from "./helpers"
import { parseAllStmt as parseAllStmts } from "./stmt"
import {
	AccesserExpr,
	AssignExpr,
	BlockExpr,
	CallExpr,
	Expr,
	IdentifierExpr,
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
	return Token.match(first, {
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
				Token.separator('"'),
				Token.separator('"'),
			)
			if (withQuotation) {
				return {
					expr: [
						"expr",
						"literal",
						Literal.string(
							Token.data(withQuotation[0][0]) as string,
						),
					],
					rest: withQuotation[1],
				}
			}
		},
	})
}

export const parseIdentiferExpr = (
	tokenStream$: TokenStream,
): ParseExprResult<IdentifierExpr> => {
	const tokenStream = skipSpaces(tokenStream$)
	const first = tokenStream.shift()
	if (!first) return

	return Token.match<ParseExprResult<IdentifierExpr>>(first, {
		identifier() {
			return {
				expr: ["expr", "identifier", this],
				rest: tokenStream,
			}
		},
		_() {},
	})
}

export const parseAccesserExpr = (
	tokenStream$: TokenStream,
): ParseExprResult<AccesserExpr> => {
	const tokenStream = skipSpaces(tokenStream$)
	const first = parseIdentiferExpr(tokenStream)
	if (!first) return

	const afterFirst = skipSpaces(first.rest)
	const exprEnded = {
		expr: ["expr", "accesser", { accessed: first.expr }],
		rest: Array.from(afterFirst),
	} as ParseExprResult<AccesserExpr>

	const next = afterFirst.shift()
	if (!next) return exprEnded

	return Token.match<ParseExprResult<AccesserExpr>>(next, {
		accesser() {
			const nextAccesser = parseAccesserExpr(afterFirst)
			if (nextAccesser) {
				return {
					expr: [
						"expr",
						"accesser",
						{
							accessed: first.expr,
							child: nextAccesser.expr[2].accessed,
						},
					],
					rest: nextAccesser.rest,
				}
			} else return exprEnded
		},
		_: () => {
			afterFirst.unshift(next)
			const withBrackets = deliminated(
				afterFirst,
				BracketTokens["("],
				BracketTokens[")"],
			)
			if (!withBrackets) return
		},
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

	return Token.match<ParseExprResult<AssignExpr>>(equalSign, {
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

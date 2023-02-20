import { AnySpaceChecker, BracketTokens, Token, TokenStream } from "../token"
import { skipSpaces, deliminated, splitStream } from "./helpers"
import {
	AccesserExpr,
	CallExpr,
	Expr,
	Literal,
	LiteralExpr,
	ReturnStmt,
	Stmt,
} from "./types"

export type ParseExprResult<ExprType extends Expr = Expr> = {
	expr: ExprType
	rest?: TokenStream
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

export type ParseAccesserExprResult = ParseExprResult<AccesserExpr>
export const parseAccesserExpr = (
	tokenStream$: TokenStream,
): ParseAccesserExprResult => {
	const tokenStream = skipSpaces(tokenStream$)
	const first = tokenStream.shift()
	if (!first) return

	return Token.match<ParseAccesserExprResult>(first, {
		identifier() {
			return {
				expr: ["expr", "accesser", { ident: this }],
				rest: tokenStream,
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

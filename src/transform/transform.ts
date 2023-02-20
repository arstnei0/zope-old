import { Literal, LiteralExpr } from "../ast/types"

export const transformLiteralExpr = (expr: LiteralExpr) => {
	const literal = expr[2]
	return `${Literal.match(literal, {
		number() {
			return `${this}`
		},
		string() {
			return `\`${this}\``
		},
		boolean() {
			return this === true ? "true" : "false"
		},
	})}`
}

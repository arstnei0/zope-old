import {
	ParseAccesserExprResult,
	ParseCallExprResult,
	ParseExprResult,
	ParseLiteralExprResult,
	parseAccesserExpr,
	parseCallExpr,
	parseLiteralExpr,
	parseOneExpr,
} from "./expr"
import { BracketTokens, Token, tokenize } from "../token"
import { Expr, Literal } from "./types"

const foo = Token.identifier("foo")

it("parseLiteralExpr", () => {
	expect(parseLiteralExpr(tokenize("20"))).toEqual({
		expr: ["expr", "literal", Literal.number(20)],
		rest: [],
	} as ParseLiteralExprResult)

	expect(parseLiteralExpr(tokenize('"Hello"'))).toEqual({
		expr: ["expr", "literal", Literal.string("Hello")],
		rest: [],
	} as ParseLiteralExprResult)

	expect(parseLiteralExpr(tokenize("true"))).toEqual({
		expr: ["expr", "literal", Literal.boolean(true)],
		rest: [],
	} as ParseLiteralExprResult)

	expect(parseLiteralExpr(tokenize("false"))).toEqual({
		expr: ["expr", "literal", Literal.boolean(false)],
		rest: [],
	} as ParseLiteralExprResult)
})

it("parseAccesserExpr", () => {
	expect(parseAccesserExpr([foo])).toEqual({
		expr: ["expr", "accesser", { ident: "foo" }],
		rest: [],
	} as ParseAccesserExprResult)
})

it("parseCallExpr", () => {
	expect(parseCallExpr(tokenize("(foo 10)"))).toEqual({
		expr: [
			"expr",
			"call",
			{
				fn: parseAccesserExpr([foo])?.expr as Expr,
				input: ["expr", "literal", Literal.number(10)],
			},
		],
		rest: [],
	} as ParseCallExprResult)
})

it("parse", () => {
	expect(parseOneExpr(tokenize(`(foo "Hello world")`))).toEqual({
		expr: [
			"expr",
			"call",
			{
				fn: ["expr", "accesser", { ident: "foo" }],
				input: ["expr", "literal", Literal.string("Hello world")],
			},
		],
		rest: [],
	} as ParseExprResult)
})

import {
	ParseCallExprResult,
	ParseExprResult,
	ParseLiteralExprResult,
	parseAccesserExpr,
	parseAssignExpr,
	parseBlockExpr,
	parseCallExpr,
	parseLiteralExpr,
	parseOneExpr,
} from "./expr"
import { TokenType, tokenize } from "../token"
import { AccesserExpr, AssignExpr, BlockExpr, Expr, Literal } from "./types"
import { parseAllStmt } from "./stmt"

const foo = TokenType.identifier("foo")

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
	expect(parseAccesserExpr(tokenize("foo.bar.baz"))).toEqual({
		expr: [
			"expr",
			"accesser",
			{
				idents: ["foo", "bar", "baz"],
			},
		],
		rest: [],
	} as ParseExprResult<AccesserExpr>)
})

it("parseBlockExpr", () => {
	expect(
		parseBlockExpr(
			tokenize(`{
		let a = 10
		return a
	}`),
		),
	).toEqual({
		expr: [
			"expr",
			"block",
			{
				stmts: parseAllStmt(
					tokenize(`
		let a = 10
		return a
			`),
				),
			},
		],
		rest: [],
	} as ParseExprResult<BlockExpr>)
})

it("parseAssignExpr", () => {
	expect(parseAssignExpr(tokenize(`foo = true`))).toEqual({
		expr: [
			"expr",
			"assign",
			{
				accesser: parseAccesserExpr(tokenize("foo"))?.expr,
				data: parseOneExpr(tokenize(`true`))?.expr,
			},
		],
		rest: [],
	} as ParseExprResult<AssignExpr>)
	expect(parseAssignExpr(tokenize(`foo.bar = true`))).toEqual({
		expr: [
			"expr",
			"assign",
			{
				accesser: parseAccesserExpr(tokenize("foo.bar"))?.expr,
				data: parseOneExpr(tokenize(`true`))?.expr,
			},
		],
		rest: [],
	} as ParseExprResult<AssignExpr>)
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
				fn: ["expr", "accesser", { idents: ["foo"] }],
				input: ["expr", "literal", Literal.string("Hello world")],
			},
		],
		rest: [],
	} as ParseExprResult)
})

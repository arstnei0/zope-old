import { tokenize } from "../token"
import { parseOneExpr } from "./expr"
import {
	ParseStmtResult,
	parseFunctionStmt,
	parseLetStmt,
	parseReturnStmt,
} from "./stmt"
import { Expr, FunctionStmt, LetStmt, ReturnStmt } from "./types"

it("parseReturnStmt", () => {
	expect(parseReturnStmt(tokenize('return "Hello world"'))).toEqual({
		stmt: [
			"stmt",
			"return",
			{ data: parseOneExpr(tokenize(`"Hello world"`))?.expr as Expr },
		],
		rest: [],
	} as ParseStmtResult<ReturnStmt>)
})

it("parseLetStmt", () => {
	const expected = {
		stmt: [
			"stmt",
			"let",
			{
				ident: "foo",
				data: parseOneExpr(tokenize(`"hello world"`))?.expr,
			},
		],
		rest: [],
	} as ParseStmtResult<LetStmt>

	expect(parseLetStmt(tokenize('let foo = "hello world"'))).toEqual(expected)
	expect(parseLetStmt(tokenize('let foo ="hello world"'))).toEqual(expected)
	expect(parseLetStmt(tokenize('let foo= "hello world"'))).toEqual(expected)
	expect(parseLetStmt(tokenize('let foo="hello world"'))).toEqual(expected)
})

it("parseFunctionStmt", () => {
	const expected = {
		stmt: [
			"stmt",
			"function",
			{
				ident: "foo",
				body: parseOneExpr(tokenize(`"hello world"`))?.expr,
			},
		],
		rest: [],
	} as ParseStmtResult<FunctionStmt>

	expect(parseFunctionStmt(tokenize('function foo "hello world"'))).toEqual(
		expected,
	)
	expect(
		parseFunctionStmt(
			tokenize(`
    function
        foo
            "hello world"`),
		),
	).toEqual(expected)
})

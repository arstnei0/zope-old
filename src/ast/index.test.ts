import { parseBlock, parseIf, parseLiteral } from "."
import { Brackets, Token } from "../token"
import { Literal, Node } from "./types"

describe("ast", () => {
	const space = Token.space(" ")
	const ident1 = Token.identifier("hello")
	const ident2 = Token.identifier("world")

	it("parseBlock", () => {
		expect(
			parseBlock([
				space,
				Token.bracket(Brackets["{"]),
				Token.bracket(Brackets["{"]),
				ident1,
				Token.bracket(Brackets["}"]),
				ident1,
				Token.bracket(Brackets["}"]),
				ident2,
			]),
		).toEqual([
			{ type: "block", body: [{ type: "block", body: [] }] } as Node,
			[ident2],
		])
	})

	it("parseIf", () => {
		expect(
			parseIf([
				space,
				Token.keyword("if"),
				Token.bracket(Brackets["("]),
				Token.bracket(Brackets["{"]),
				ident2,
				Token.bracket(Brackets["}"]),
				Token.bracket(Brackets[")"]),
				Token.bracket(Brackets["{"]),
				Token.bracket(Brackets["{"]),
				ident2,
				Token.bracket(Brackets["}"]),
				Token.bracket(Brackets["}"]),
			]),
		).toEqual([
			{
				type: "if",
				condition: { type: "block", body: [] },
				then: { type: "block", body: [] },
			},
			[],
		])
	})

	it("parseLiteral", () => {
		expect(parseLiteral([Token.identifier("100")])).toEqual([
			{ type: "literal", data: Literal.number(100) } as Node,
			[],
		])

		expect(
			parseLiteral([
				Token.separator('"'),
				Token.identifier("Hello"),
				Token.separator('"'),
			]),
		).toEqual([
			{ type: "literal", data: Literal.string("Hello") } as Node,
			[],
		])
	})
})

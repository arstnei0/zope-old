import { parseBlock, parseCall, parseIf, parseLiteral } from "./index-old"
import { Brackets, NumberChar, Token } from "../token"
import { Literal, Node } from "./types"

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

it("parseCall", () => {
	expect(
		parseCall([
			Token.identifier("add"),
			Token.bracket(Brackets["("]),
			Token.number(["1"]),
			Token.bracket(Brackets[")"]),
		]),
	).toEqual([
		{
			type: "call",
			fn: { type: "read", identifier: "add" },
			in: { type: "literal", data: Literal.number(1) },
		} as Node,
		[],
	])
})

it("parseLiteral", () => {
	expect(parseLiteral([Token.number([..."100"] as NumberChar[])])).toEqual([
		{ type: "literal", data: Literal.number(100) } as Node,
		[],
	])

	expect(
		parseLiteral([
			Token.separator('"'),
			Token.separated("Hello"),
			Token.separator('"'),
		]),
	).toEqual([{ type: "literal", data: Literal.string("Hello") } as Node, []])

	expect(parseLiteral([Token.keyword("true")])).toEqual([
		{ type: "literal", data: Literal.boolean(true) } as Node,
		[],
	])
})

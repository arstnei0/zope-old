import { Bracket, TokenType, ignoreTokenPos, tokenize } from "."
import { twice } from "../utils/twice"

it("brackets", () => {
	expect(tokenize("(){}[]<>")).toEqual([
		[[0, 0], TokenType.bracket(Bracket.open("paren"))],
		[[1, 1], TokenType.bracket(Bracket.close("paren"))],
		[[2, 2], TokenType.bracket(Bracket.open("curly"))],
		[[3, 3], TokenType.bracket(Bracket.close("curly"))],
		[[4, 4], TokenType.bracket(Bracket.open("square"))],
		[[5, 5], TokenType.bracket(Bracket.close("square"))],
		[[6, 6], TokenType.bracket(Bracket.open("angle"))],
		[[7, 7], TokenType.bracket(Bracket.close("angle"))],
	])
})

it("punctuations", () => {
	expect(tokenize(",;")).toEqual([
		[[0, 0], TokenType.punctuation(",")],
		[[1, 1], TokenType.punctuation(";")],
	])
})

it("visitor", () => {
	expect(tokenize(".")).toEqual([[[0, 0], TokenType.accesser()]])
})

it("keywords", () => {
	expect(tokenize("let state memo computed mut component")).toEqual([
		[[0, 3], TokenType.keyword("let")],
		[[3, 3], TokenType.space(" ")],
		[[4, 9], TokenType.keyword("state")],
		[[9, 9], TokenType.space(" ")],
		[[10, 14], TokenType.keyword("memo")],
		[[14, 14], TokenType.space(" ")],
		[[15, 23], TokenType.keyword("computed")],
		[[23, 23], TokenType.space(" ")],
		[[24, 27], TokenType.keyword("mut")],
		[[27, 27], TokenType.space(" ")],
		[[28, 37], TokenType.keyword("component")],
	])
})

it("identifiers", () => {
	expect(tokenize("hello.world").map(($) => $[1])).toEqual([
		TokenType.identifier("hello"),
		TokenType.accesser(),
		TokenType.identifier("world"),
	])
})

it("separators", () => {
	expect(tokenize("''``\"\"").map(($) => $[1])).toEqual([
		TokenType.separator(`'`),
		TokenType.separated(""),
		TokenType.separator(`'`),
		TokenType.separator(`\``),
		TokenType.separated(""),
		TokenType.separator(`\``),
		TokenType.separator(`"`),
		TokenType.separated(""),
		TokenType.separator(`"`),
	])
})

it("number", () => {
	expect(ignoreTokenPos(tokenize("100"))).toEqual([
		TokenType.number(["1", "0", "0"]),
	])
})

it("separated", () => {
	expect(ignoreTokenPos(tokenize("'Hello world!!!'"))).toEqual([
		TokenType.separator(`'`),
		TokenType.separated("Hello world!!!"),
		TokenType.separator(`'`),
	])
})

it("operators", () => {
	expect(ignoreTokenPos(tokenize("="))).toEqual([TokenType.operator("=")])
})

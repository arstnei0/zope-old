import { Bracket, Token, tokenize } from "."

it("brackets", () => {
	expect(tokenize("(){}[]<>")).toEqual([
		Token.bracket(Bracket.open("paren")),
		Token.bracket(Bracket.close("paren")),
		Token.bracket(Bracket.open("curly")),
		Token.bracket(Bracket.close("curly")),
		Token.bracket(Bracket.open("square")),
		Token.bracket(Bracket.close("square")),
		Token.bracket(Bracket.open("angle")),
		Token.bracket(Bracket.close("angle")),
	])
})

it("punctuations", () => {
	expect(tokenize(",;")).toEqual([
		Token.punctuation(","),
		Token.punctuation(";"),
	])
})

it("visitor", () => {
	expect(tokenize(".")).toEqual([Token.visitor()])
})

it("keywords", () => {
	expect(tokenize("let state memo computed mut component")).toEqual([
		Token.keyword("let"),
		Token.space(" "),
		Token.keyword("state"),
		Token.space(" "),
		Token.keyword("memo"),
		Token.space(" "),
		Token.keyword("computed"),
		Token.space(" "),
		Token.keyword("mut"),
		Token.space(" "),
		Token.keyword("component"),
	])
})

it("identifiers", () => {
	expect(tokenize("hello.world")).toEqual([
		Token.identifier("hello"),
		Token.visitor(),
		Token.identifier("world"),
	])
})

it("separators", () => {
	expect(tokenize("''``\"\"")).toEqual([
		Token.separator(`'`),
		Token.separated(""),
		Token.separator(`'`),
		Token.separator(`\``),
		Token.separated(""),
		Token.separator(`\``),
		Token.separator(`"`),
		Token.separated(""),
		Token.separator(`"`),
	])
})

it("number", () => {
	expect(tokenize("100")).toEqual([Token.number(["1", "0", "0"])])
})

it("separated", () => {
	expect(tokenize("'Hello world!!!'")).toEqual([
		Token.separator(`'`),
		Token.separated("Hello world!!!"),
		Token.separator(`'`),
	])
})

it("operators", () => {
	expect(tokenize("=")).toEqual([Token.operator("=")])
})

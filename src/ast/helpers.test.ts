import {
	AnySpaceChecker,
	Brackets,
	TokenType,
	ignoreTokenPos,
	tokenize,
} from "../token"
import { deliminated, skipSpaces, splitStream } from "./helpers"

const space = TokenType.space(" ")
const ident1 = TokenType.identifier("h1")
const ident2 = TokenType.identifier("after")

it("skipSpaces", () => {
	expect(skipSpaces([space, TokenType.identifier("foo"), space])).toEqual([
		TokenType.identifier("foo"),
	])

	expect(
		skipSpaces([space, TokenType.identifier("foo"), space], { end: false }),
	).toEqual([TokenType.identifier("foo"), space])

	expect(
		skipSpaces([space, TokenType.identifier("foo"), space], {
			start: false,
		}),
	).toEqual([space, TokenType.identifier("foo")])
})

it("deliminated", () => {
	expect(
		deliminated(
			tokenize(`<h1>after`),
			TokenType.bracket(Brackets["<"]),
			TokenType.bracket(Brackets[">"]),
		)?.map(($) => ignoreTokenPos($)),
	).toEqual([[ident1], [ident2]])
})

it("splitStream", () => {
	expect(splitStream([ident1, space, ident2], AnySpaceChecker)).toEqual([
		[ident1],
		[ident2],
	])
})

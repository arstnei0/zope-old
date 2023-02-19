import { Brackets, Token } from "../token"
import { delimited, skipSpaces } from "./helpers"

describe("ast helpers", () => {
	const space = Token.space(" ")
	const ident1 = Token.identifier("h1")
	const ident2 = Token.identifier("after")

	it("skipSpaces", () => {
		expect(skipSpaces([space, Token.identifier("foo"), space])).toEqual([
			Token.identifier("foo"),
		])

		expect(
			skipSpaces([space, Token.identifier("foo"), space], { end: false }),
		).toEqual([Token.identifier("foo"), space])

		expect(
			skipSpaces([space, Token.identifier("foo"), space], {
				start: false,
			}),
		).toEqual([space, Token.identifier("foo")])
	})

	it("deliminated", () => {
		expect(
			delimited(
				[
					space,
					Token.bracket(Brackets["<"]),
					ident1,
					Token.bracket(Brackets[">"]),
					ident2,
				],
				Token.bracket(Brackets["<"]),
				Token.bracket(Brackets[">"]),
			),
		).toEqual([[ident1], [ident2]])
	})
})

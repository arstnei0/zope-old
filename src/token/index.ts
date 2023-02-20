export type BracketType = "paren" | "curly" | "square" | "angle"
export const Bracket = Enum<{ open: BracketType; close: BracketType }>()
export type Bracket = typeof Bracket.item
export const Brackets = {
	"(": Bracket.open("paren"),
	")": Bracket.close("paren"),
	"{": Bracket.open("curly"),
	"}": Bracket.close("curly"),
	"[": Bracket.open("square"),
	"]": Bracket.close("square"),
	"<": Bracket.open("angle"),
	">": Bracket.close("angle"),
} as const

export const Punctuations = [",", ";"] as const
export type Punctuation = (typeof Punctuations)[number]

export const Keywords = [
	"let",
	"state",
	"memo",
	"computed",
	"mut",
	"component",
	"this",
	"function",
	"import",
	"use",
	"export",
	"return",
	"if",
	"else",
	"true",
	"false",
] as const
export type Keyword = (typeof Keywords)[number]

export const Spaces = [" ", "\n", "\t"] as const
export type Space = (typeof Spaces)[number]

export const Operators = ["="] as const
export type Operator = (typeof Operators)[number]

export const Seperators = ['"', "'", "`"] as const
export type Seperator = (typeof Seperators)[number]

export const NumberChars = [
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"0",
	".",
] as const
export type NumberChar = (typeof NumberChars)[number]

export const TokenType = Enum<{
	bracket: Bracket
	punctuation: Punctuation
	accesser: void
	keyword: Keyword
	separated: string
	identifier: string
	number: NumberChar[]
	space: Space
	operator: Operator
	separator: Seperator
}>()
export type TokenType = typeof TokenType.item
export type TokenPos = [number, number]
export type Token = [TokenPos, TokenType]
export type TokenStream = Token[]

export const BracketTokens = {
	"(": TokenType.bracket(Brackets["("]),
	")": TokenType.bracket(Brackets[")"]),
	"[": TokenType.bracket(Brackets["["]),
	"]": TokenType.bracket(Brackets["]"]),
	"{": TokenType.bracket(Brackets["{"]),
	"}": TokenType.bracket(Brackets["}"]),
	"<": TokenType.bracket(Brackets["<"]),
	">": TokenType.bracket(Brackets[">"]),
} as const

export const AnySpaceChecker = (token: TokenType) =>
	TokenType.type(token) === "space"

export const ignoreTokenPos = (ts: TokenStream) => ts.map(($) => $[1])

export const tokenize = (code: string): TokenStream => {
	const stream: TokenStream = []
	const codeArr = Array.from(`${code}\n`)

	let currIdentifier: string | null = null
	let currIdentifierStart: number | null = null

	let separated: TokenType | null = TokenType.separated("") || null
	let separatedStart: number | null = null
	let openedSeparator: Seperator | null = null

	let currNumber: NumberChar[] | null = null
	let currNumberStart: number | null = null

	for (const iStr in codeArr) {
		const i = +iStr
		const char = codeArr[i]
		const isSeparator = Seperators.includes(char as Seperator)

		if (openedSeparator && separatedStart !== null) {
			if (openedSeparator === char) {
				stream.push([[separatedStart, i - 1], separated])
				separated = TokenType.separated("")
				stream.push([
					[separatedStart, i],
					TokenType.separator(char as Seperator),
				])
				openedSeparator = null
			} else {
				separated = TokenType.separated(
					`${TokenType.data(separated)}${char}`,
				)
			}
			continue
		}

		const isSpace = Spaces.includes(char as Space)
		const isOperator = Operators.includes(char as Operator)
		const isPuncuation = Punctuations.includes(char as Punctuation)
		const isBracket = Reflect.has(Brackets, char)
		const isNumber = Reflect.has(NumberChars, char)
		const isVisitor = char === "."
		const isIdent = !(
			isOperator ||
			isNumber ||
			isSeparator ||
			isSpace ||
			isPuncuation ||
			isBracket ||
			isVisitor
		)

		if (currNumber !== null && currNumberStart !== null) {
			if (isNumber) {
				currNumber.push(char as NumberChar)
				continue
			} else {
				stream.push([
					[currNumberStart, i],
					TokenType.number(currNumber),
				])
				currNumber = null
				currNumberStart = null
			}
		}
		if (
			!isIdent &&
			currIdentifier !== null &&
			currIdentifierStart !== null
		) {
			if (Keywords.includes(currIdentifier as Keyword)) {
				stream.push([
					[currIdentifierStart, i],
					TokenType.keyword(currIdentifier as Keyword),
				])
			} else {
				stream.push([
					[currIdentifierStart, i],
					TokenType.identifier(currIdentifier),
				])
			}
			currIdentifier = null
			currIdentifierStart = null
		}
		if (isSpace) {
			stream.push([[i, i], TokenType.space(char as Space)])
		} else if (isSeparator) {
			stream.push([[i, i], TokenType.separator(char as Seperator)])
			separated = TokenType.separated("")
			openedSeparator = char as Seperator
			separatedStart = i
		} else if (isNumber) {
			currNumber = [char as NumberChar]
			currNumberStart = i
		} else if (isOperator) {
			stream.push([[i, i], TokenType.operator(char as Operator)])
		} else if (isPuncuation) {
			stream.push([[i, i], TokenType.punctuation(char as Punctuation)])
		} else if (isBracket) {
			stream.push([
				[i, i],
				TokenType.bracket(Brackets[char as keyof typeof Brackets]),
			])
		} else if (isVisitor) {
			stream.push([[i, i], TokenType.accesser()])
		} else {
			if (currIdentifier === null) {
				currIdentifier = ""
				currIdentifierStart = i
			}
			currIdentifier += char
		}
	}

	stream.pop()

	return stream
}

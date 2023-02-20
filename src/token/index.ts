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

export const Token = Enum<{
	bracket: Bracket
	punctuation: Punctuation
	visitor: void
	keyword: Keyword
	separated: string
	identifier: string
	number: NumberChar[]
	space: Space
	operator: Operator
	separator: Seperator
}>()
export type Token = typeof Token.item
export type TokenStream = Token[]

export const BracketTokens = {
	"(": Token.bracket(Brackets["("]),
	")": Token.bracket(Brackets[")"]),
	"[": Token.bracket(Brackets["["]),
	"]": Token.bracket(Brackets["]"]),
	"{": Token.bracket(Brackets["{"]),
	"}": Token.bracket(Brackets["}"]),
	"<": Token.bracket(Brackets["<"]),
	">": Token.bracket(Brackets[">"]),
} as const

export const AnySpaceChecker = (token: Token) => Token.type(token) === "space"

export const tokenize = (code: string): TokenStream => {
	const stream: TokenStream = []
	const codeArr = Array.from(`${code}\n`)

	let currIdentifier: string | null = null

	let separated: Token | null = Token.separated("") || null
	let openedSeparator: Seperator | null = null

	let currNumber: NumberChar[] | null = null

	for (const i in codeArr) {
		const char = codeArr[i]
		const isSeparator = Seperators.includes(char as Seperator)

		if (openedSeparator) {
			if (openedSeparator === char) {
				stream.push(separated)
				separated = Token.separated("")
				stream.push(Token.separator(char as Seperator))
				openedSeparator = null
			} else {
				separated = Token.separated(`${Token.data(separated)}${char}`)
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

		if (currNumber !== null) {
			if (isNumber) {
				currNumber.push(char as NumberChar)
				continue
			} else {
				stream.push(Token.number(currNumber))
				currNumber = null
			}
		}
		if (!isIdent && currIdentifier !== null) {
			if (Keywords.includes(currIdentifier as Keyword)) {
				stream.push(Token.keyword(currIdentifier as Keyword))
			} else {
				stream.push(Token.identifier(currIdentifier))
			}
			currIdentifier = null
		}
		if (isSpace) {
			stream.push(Token.space(char as Space))
		} else if (isSeparator) {
			stream.push(Token.separator(char as Seperator))
			separated = Token.separated("")
			openedSeparator = char as Seperator
		} else if (isNumber) {
			currNumber = [char as NumberChar]
		} else if (isOperator) {
			stream.push(Token.operator(char as Operator))
		} else if (isPuncuation) {
			stream.push(Token.punctuation(char as Punctuation))
		} else if (isBracket) {
			stream.push(Token.bracket(Brackets[char as keyof typeof Brackets]))
		} else if (isVisitor) {
			stream.push(Token.visitor())
		} else {
			if (currIdentifier === null) currIdentifier = ""
			currIdentifier += char
		}
	}

	stream.pop()

	return stream
}

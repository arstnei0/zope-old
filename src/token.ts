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
] as const
export type Keyword = (typeof Keywords)[number]

export const Spaces = [" ", "\n", "\t"] as const
export type Space = (typeof Spaces)[number]

export const Operators = ["="] as const
export type Operator = (typeof Operators)[number]

export const Seperators = ['"', "'", "`"] as const
export type Seperator = (typeof Seperators)[number]

export const Token = Enum<{
	bracket: Bracket
	punctuation: Punctuation
	visitor: void
	keyword: Keyword
	identifier: string
	space: Space
	operator: Operator
	separator: Seperator
}>()
export type Token = typeof Token.item
export type TokenStream = Token[]

export const tokenize = (code: string): TokenStream => {
	const stream: TokenStream = []
	const codeArr = Array.from(`${code} `)
	let currIdentifier: string | null = null

	for (const i in codeArr) {
		const char = codeArr[i]
		const isSpace = Spaces.includes(char as Space)
		const isOperator = Operators.includes(char as Operator)
		const isPuncuation = Punctuations.includes(char as Punctuation)
		const isSeparator = Seperators.includes(char as Seperator)
		const isBracket = Reflect.has(Brackets, char)
		const isVisitor = char === "."
		const isIdent = !(
			isOperator ||
			isSeparator ||
			isSpace ||
			isPuncuation ||
			isBracket ||
			isVisitor
		)

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

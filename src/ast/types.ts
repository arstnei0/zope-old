import { TokenStream } from "../token"

export const Literal = Enum<{
	string: string
	number: number
	boolean: boolean
}>()
export type Literal = typeof Literal.item

export type Node =
	| { type: "program"; program: Node[] }
	| { type: "literal"; data: Literal }
	| { type: "assign"; from: Node; to: Node }
	| { type: "identifier"; name: string }
	| { type: "call"; fn: Node; args: Node }
	| { type: "lambda"; body: Node; args: Node }
	| { type: "block"; body: Node[] }
	| { type: "let"; ident: Node; body: Node }
	| { type: "if"; condition: Node; then: Node }

export type Parsed = [result: Node, rest: TokenStream | void] | void
export type Parser = (tokenStream: TokenStream) => Parsed
export type Helper = (tokenStream: TokenStream) => TokenStream

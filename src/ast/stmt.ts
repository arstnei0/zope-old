import { Token, TokenStream } from "../token"
import { skipSpaces } from "./helpers"
import { ReturnStmt, Stmt } from "./types"
import { parseOneExpr } from "./expr"

export type ParseStmtResult<StmtType extends Stmt = Stmt> = {
	stmt: StmtType
	rest?: TokenStream
} | void

export const parseReturnStmt = (
	tokenStream$: TokenStream,
): ParseStmtResult<ReturnStmt> => {
	const tokenSream = skipSpaces(tokenStream$)
	const first = tokenSream.shift()
	if (!first) return
	return Token.match<ParseStmtResult<ReturnStmt>>(first, {
		keyword() {
			if (this !== "return") return
			const data = parseOneExpr(tokenSream)
			if (!data) return
			return {
				stmt: ["stmt", "return", { data: data.expr }],
				rest: data.rest,
			}
		},
		_() {},
	})
}

export const parseOneStmt = (tokenStream: TokenStream): ParseStmtResult => {
	const returnStmt = parseReturnStmt(tokenStream)
	if (returnStmt) return returnStmt
}

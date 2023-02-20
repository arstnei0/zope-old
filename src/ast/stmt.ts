import { Token, TokenStream } from "../token"
import { skipSpaces } from "./helpers"
import { FunctionStmt, LetStmt, ReturnStmt, Stmt } from "./types"
import { parseOneExpr } from "./expr"

export type ParseStmtResult<StmtType extends Stmt = Stmt> = {
	stmt: StmtType
	rest: TokenStream
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

export const parseLetStmt = (
	tokenStream$: TokenStream,
): ParseStmtResult<LetStmt> => {
	const tokenSream = skipSpaces(tokenStream$)
	const first = tokenSream.shift()
	if (!first) return

	return Token.match<ParseStmtResult<LetStmt>>(first, {
		keyword() {
			if (this !== "let") return

			const afterLet = skipSpaces(tokenSream)
			const identToken = afterLet.shift()
			if (!identToken) return

			return Token.match<ParseStmtResult<LetStmt>>(identToken, {
				identifier(ident) {
					const afterIdent = skipSpaces(afterLet)
					const equalSign = afterIdent.shift()
					if (!equalSign) return

					return Token.match<ParseStmtResult<LetStmt>>(equalSign, {
						operator() {
							if (this !== "=") return

							const afterEqualSign = skipSpaces(afterIdent)
							if (!afterEqualSign) return

							const data = parseOneExpr(afterEqualSign)
							if (!data) return

							return {
								stmt: [
									"stmt",
									"let",
									{ ident: ident, data: data.expr },
								],
								rest: data.rest,
							}
						},
						_() {},
					})
				},
				_() {},
			})
		},
		_() {},
	})
}

export const parseFunctionStmt = (
	tokenStream$: TokenStream,
): ParseStmtResult<FunctionStmt> => {
	const tokenSream = skipSpaces(tokenStream$)
	const first = tokenSream.shift()
	if (!first) return

	return Token.match<ParseStmtResult<FunctionStmt>>(first, {
		keyword() {
			if (this !== "function") return

			const afterLet = skipSpaces(tokenSream)
			const identToken = afterLet.shift()
			if (!identToken) return

			return Token.match<ParseStmtResult<FunctionStmt>>(identToken, {
				identifier(ident) {
					const afterIdent = skipSpaces(afterLet)
					if (!afterIdent) return

					const body = parseOneExpr(afterIdent)
					if (!body) return

					return {
						stmt: [
							"stmt",
							"function",
							{ ident: ident, body: body.expr },
						],
						rest: body.rest,
					}
				},
				_() {},
			})
		},
		_() {},
	})
}

export const parseOneStmt = (tokenStream: TokenStream): ParseStmtResult => {
	const returnStmt = parseReturnStmt(tokenStream)
	if (returnStmt) return returnStmt
	const letStmt = parseLetStmt(tokenStream)
	if (letStmt) return letStmt
}

export const parseAllStmt = (tokenStream: TokenStream): Stmt[] => {
	let rest = tokenStream
	const stmts = [] as Stmt[]
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const stmt = parseOneStmt(rest)
		if (!stmt) break

		stmts.push(stmt.stmt)
		rest = stmt.rest
	}

	return stmts
}

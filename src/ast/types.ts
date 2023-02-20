export const Literal = Enum<{
	string: string
	number: number
	boolean: boolean
}>()
export type Literal = typeof Literal.item

// Expr
export type ExprBase<t extends string, c> = ["expr", t, c]

export type LiteralExpr = ExprBase<"literal", Literal>
export type AccesserExpr = ExprBase<"accesser", { idents: string[] }>
export type CallExpr = ExprBase<"call", { fn: Expr; input: Expr }>
export type AssignExpr = ExprBase<
	"assign",
	{ accesser: AccesserExpr; data: Expr }
>
export type BlockExpr = ExprBase<"block", { stmts: Stmt[] }>

export type Expr =
	| LiteralExpr
	| AccesserExpr
	| CallExpr
	| BlockExpr
	| AssignExpr

// Stmt
export type StmtBase<t extends string, c> = ["stmt", t, c]

export type LetStmt = StmtBase<"let", { ident: string; data: Expr }>
export type ReturnStmt = StmtBase<"return", { data: Expr }>
export type FunctionStmt = StmtBase<"function", { ident: string; body: Expr }>

export type Stmt = LetStmt | ReturnStmt | FunctionStmt
export type Node = Stmt | Expr

import { parseLiteralExpr } from "../ast/expr"
import { LiteralExpr } from "../ast/types"
import { tokenize } from "../token"
import { transformLiteralExpr } from "./transform"

it("transformLiteral", () => {
	expect(
		transformLiteralExpr(
			parseLiteralExpr(tokenize(`"hello world"`))?.expr as LiteralExpr,
		),
	).toEqual("`hello world`")
	expect(
		transformLiteralExpr(
			parseLiteralExpr(tokenize(`123`))?.expr as LiteralExpr,
		),
	).toEqual("123")
	expect(
		transformLiteralExpr(
			parseLiteralExpr(tokenize(`true`))?.expr as LiteralExpr,
		),
	).toEqual("true")
})

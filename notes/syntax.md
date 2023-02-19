Example:

```
function () {
    log "Hello world"
    function double count = multiply (count, 2)
}
```

# Definition

number = (e.g. 10, 13.4)
string = `"..."` | `'...'`
boolean = `true` | `false`
tuple = `([ ]{item: expression}[ ],[ ]...[ ])`
array = `[[ ]{item: expression}[ ],[ ]...[ ]]`
struct = `{[ ]{key: identifier}:[ ]{value: expression},[ ]...}`
literal = number | string | boolean | tuple | array

var = `{name: identifier}`

expression = call | literal | read | var | block

call = `{name: identifier} {input: expression}`

visitor =
| `{target: expression}.{visit: number}`
| `{target: expression}.{visit: string}`
| `{target: expression}[{visit: expression}]`

assign = `{var: var}[ ]=[ ]expression`
declare = `let {var: var}[ ][=[ ]expression]`
function = `function {var: var} {input: expression} {expression: expression}`

statement = `{statement: call | assign | declare}[;]`
block = `\{[ ]{...statements: statement}[ ]\}`

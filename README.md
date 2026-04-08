# tc | typecheck

A lightweight utility for flexible type checking in JavaScript.

## Quick Reference

1. Discover Mode: 	`typecheck( val )`
2. Query Mode: 		`typecheck( val, type )`
1. Options Mode: 	`typecheck( val, type, option )`


```javascript
import typecheck as tc from './index'

const num = 5
const dec = 5.5
const num2 = "1,566,387"
const nonNum = NaN
tc(num) 				// → 'int'
tc(num, null, 'e') 		// → 'number int'
tc(dec) 				// → 'float'
tc(dec, null, 'a')		// → ['string', 'float']
tc(nonNum, NaN, 'c')	// → true
tc(nonNum, '', 'e')		// → 'number NaN'
tc( nonNum, 
  ['digits', 'int'] )	// → 'false'

const myObj = { foo: 'bar', num, dec }
typeof myObj 			// → 'object'
typeof Error() 			// → 'object'
tc({}, 'object')		// → true
tc(Error())				// → 'error'
tc(myObj)				// → 'object'
tc(myObj, 0, 'e')		// → 'object-literal'

let res = await fetch('http://www.example.com/api/0');
res = await res.json();
const { log } = console;
const mapLog = (d) => d.forEach(v => printFlat(v));

(function printFlat(data) {
	switch ( tc(data) ) {
		case 'object': 		return mapLog(Object.values(data));
		break;
		case 'array': 		return mapLog(data);
		break;
		default: 			return tc(data, 'primitive')	
								? log(data)
								: null
	}
})(res)
```

***

> NOTE: null and undefined will throw unless explicitly declared.
> ```javascript
> let myVal;
> typecheck(myVal)
> // → 'undefined'
>
> typecheck(anotherVal)
> // → throws RefError
>```

## MODE 1: Discover Mode

**Usage:** `typecheck(val)`

`@param {*} val`
Value to evaluate.

`@returns {string}`\
  Returns:
  - tc-defined type (if applicable)
  - Otherwise: val.constructor.name

***

## MODE 2: Query Mode

**Usage:** `typecheck(val, type)`

`@param {*} val`
  Value to evaluate.

`@param {string|array} type`
  - string: compare val against a single tc or js type
  - array: logical OR comparison against multiple types

`@returns {boolean}`
- true if match found
- arrays by default return true if ANY type matches
	- use option 'every' for logical AND comparison

***

## MODE 3: Options

**Usage:** typecheck(val, type, option)

`@param {string} option`\
Must be the 3rd parameter. Only one option allowed per call.

### Options:

**c | compare**\
Compare constructor types directly.\
Usage: typecheck(val, val, 'c')

`@returns {boolean}`

\
**p | proto | prototype**\
Tests against Object.prototype.toString.call(val)
(ignores tc custom types)

*Examples:*
```javascript
// Check Mode: 
typecheck( BigInt(5), null, 'p' ) 
// → "[object BigInt]"

// Query Mode: 
typecheck( [], 'array', 'p' )
// → true
```

\
**e | extended**\
Performs multiple checks:
- constructor name
- Object.prototype result
- tc type

\
`@returns {string}`\
Returns list of results when tc type differs from js type.\
Works with Discover mode (1) only.

*Examples:*
```javascript
typecheck( "1,332", null, 'e' )
// → "string int" 

typecheck( {} )				
// → "object" 
typecheck( {}, null, 'e' )	
// → "object-literal" 

typecheck( "4D", '', 'e' ) 
// → "string"
```

\
**a | array**\
Same as extended mode, but returns all results as an array.

`@returns {array}`

*Examples:*
```javascript
typecheck( '-42', null, 'e' ) 
// → ['string', 'int']

typecheck( '+120', null, 'e' ) 
// → ['string']
```

\
**every | some**\
*In multi-query mode (when `type` is an array)*\
Returns true if either *some* OR *every* query matches.\
Default = some

`@returns {boolean}`

*Examples:*
```javascript
typecheck('45', ['str', 'int', 'num', 'float']) // default = 'some'
// → true

typecheck('45', ['str', 'int', 'num', 'float'], 'every')
// → false 
// (neither a number nor a float)

typecheck('45', 'num-str') && typecheck('45', 'int')
// → true
```

***

## tc Custom Types

### object-literal
A plain JavaScript object ({}), distinct from class instances.

*Example:*
```javascript
typeof new Map()
// → 'object'

typecheck( new Map(), 'object' ) 
// → false

typecheck( new Map() )
// → 'map'

typecheck( {}, null, 'e' )
// → 'object-literal'
```

### primitive
Any JavaScript primitive type.

### digits
Numeric-only values (string or number), including:
- positive/negative integers
- decimals
- comma structured numbers

*Examples:*
| val	 		|   | tc type		|
| ------------- | - | ------------- |
| "-5" 			| → | digits int	|
| ".5" 			| → | digits float	|
| "1,534,698" 	| → | digits int	|
| "+5" 			| → | string		|

### numeric-string
A string representing a valid number.\
Evluates the same as digits, only when val is a string.

### int
Integer values (string or number).

### float
Floating point values.

*Examples:*
| val	 		|   | tc type		|
| ------------- | - | ------------- |
| "0.0"			| → | float			|
| -.0			| → | float			|
| "1,698.121" 	| → | float			|
| "0." 			| → | string		|

### Number
Native JavaScript Number type.\
*(float & int; not numeric-strings)*

*Example:*
```javascript
typecheck( 10, null, 'e' ) 
// → 'number int'

typecheck( Infinity )
// → 'number'

typecheck( Infinity, 'int' )
// → false
```

***

## TYPE ABBREVIATIONS

The following shorthand aliases are supported:

| Term 				|→| Shorthand 			|
| ----------------- |-| ------------------- |
|  string 			|→| str		  			|
|  number 			|→| num		  			|
|  array 			|→| arr		  			|
|  object 			|→| obj, object-literal	|
|  boolean 			|→| bool				|
|  function 		|→| func				|
|  integer 			|→| int					|
|  floating-point	|→| float 				|
|  numeric-string 	|→| numstr, num-str		|

\
*Example:*
```javascript
tc(val, 'str') === tc(val, 'string')
```

/**
 * Expanded type checking. i.e. tc(myObj):String | tc([], 'object'):Boolean (= false) | tc(myObj, null, 'p'):String.
 * 
 * 'tc types' include: 'object' = object-literal only, digit|float|int|num, str|string, Map, error, etc.
 * @param {*} val - Mode 1: The value you want to check.
 * @param {String|Array} [type] - Mode 2: Check if 'val' is tc 'type'. Pass an array to check if 'val' is any of 'types' in array.
 * @param {String} [option] - Mode 3: 'c|compare': Check if 2 vals have same constructor. 'p|prototype': Tests against 'Object.prototype.toString.call(val)' (ignores tc custom types)
 * @returns {String|Boolean} Mode 1: String. Mode 2: Boolean. Mode 3: c=Boolean|p=String
 */
declare function typecheck(val:any, type?:string|string[], option?:string):string|boolean;
export = typecheck
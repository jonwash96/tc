/** tc | typecheck
 * ****************************************************************************
 * Author: Jonathan Washington
 * Description: A handy function for simple typechecking in js.
 * Version: 0.2
 * Copyright (c) 2026 Jonathan Washington
 * ****************************************************************************
*/

const isObjectLiteral = (arg) =>
	!(arg === null || typeof arg === 'undefined')
		? arg.constructor.name === 'Object'
		: false;

const extractProto = (val) =>
	Object.prototype.toString.call(val)
		.split(' ')[1]
		.slice(0, -1)
		.toLowerCase();

		
export default function typecheck(val, type, option) {
	const isInt = typeof val === 'number'
		? val % 1 === 0
		: typeof val === 'string'
			? val.includes(',')
				? /^-?\d{1,3}(?:,\d{3})+$/g.test(val)
				: /^-?\d+$/g.test(val)
			: false;

	const isFloat = typeof val === 'number'
		? val % 1 !== 0
		: typeof val === 'string'
			? val.includes(',')
				? /^-?(?:\d+|\d{1,3}(?:,\d{3})+)\.\d+$/g.test(val)
				: /^-?(?:\d+\.\d+|\.\d+)$/.test(val)
			: false;

	const casein = (r) => r.test(type);
	const caseis = (w) => w === (type);

	try {
		//* Recursive mode for multiple queries
		if (type && Array.isArray(type)) 
			switch (option.toLowerCase()) {
				case 'every': 			return type.every(q => typecheck(val, q))
				case 'some': default: 	return type.some(q => typecheck(val, q))
			};

		//* Determine type query vs comparison mode. If query, normalize to lowercase.
		if (type && typeof type === 'string' && !/^(c|compare)$/i.test(option))
			type = type.toLowerCase()
		else if (/^(c|compare)$/i.test(option))
			return val.constructor.name === type.constructor.name

		// *************************************************************************** //
		//* Type Query Mode with extended types
		if (type && typeof type === 'string') {
			if (option && /^(p|proto|prototype)$/i.test(option))
				return Object.prototype.toString.call(val)
					.split(' ')[1]
					.toLowerCase()
					.includes(type);

			if (caseis('null')) return val === null
			else if (val === null) {
				console.warn('tc got', null, 'checking for:', type);
				return false
			};

			if (caseis('undefined')) return typeof val === 'undefined'
			else if (typeof val === 'undefined') {
				console.warn('tc got', undefined, 'checking for:', type);
				return false
			};

			if (casein(/^(float|floating-?point|float-?string|digits)$/i))
				return isFloat;

			if (casein(/^(int|integer|digits)$/i))
				return isInt;

			if (caseis('NaN')) 
				return Number.isNaN(val);

			if (casein(/^(num-?str|numeric-?string)$/))
				return typeof val === 'string' && (isInt || isFloat);

			if (casein(/^(str|string|num|number|bool|boolean|sym|symbol|arr|array|func|function|bigint|date|RegExp|error|promise)$/i))
				return val.constructor.name.toLowerCase().startsWith(type);

			if (casein(/^(map|tupple)$/))
				return val.constructor.name === 'Map';

			if (caseis('primitive')) 
				return /string|number|boolean|bigint|symbol/i.test(typeof val);

			/** Distinguish between object literal & other object types.
			    CAUTION: Objects that are not object-literals will return false. Use typeof instead. */
			if (casein(/^(obj|object|object-?literal)$/)) 
				return isObjectLiteral(val)
		}
		// *************************************************************************** //
		else if (type && type !== 'string') { throw new Error("tc Error! <type> (2nd arg) must be string, or pass 3rd arg 'c|compare' for a type comparison. Got", typeof type, type) }
		// *************************************************************************** //
		//* Type check Mode
		else {
			if (option && /^(p|proto|prototype)$/i.test(option))
				return Object.prototype.toString.call(val);

			let result;
			if 		(isFloat) 				result = 'float'
			else if (isInt) 				result = 'int'
			else if (isObjectLiteral(val)) 	result = 'object'
			else if (Array.isArray(val)) 	result = 'array'
			else if (typeof val === 'number' && Number.isNaN(val)) result = 'NaN'
			else result = val.constructor.name.toLowerCase();

			if (!option) return result;

			// Extended Result Mode
			if (option && /^(a|array|e|extended)$/i.test(option)) {
				const protoVal = extractProto(val);
				const name = val.constructor.name.toLowerCase();

				let extendedResult = (
					result !== name
						? name === protoVal
							? name + " " + result
							: name + " " + protoVal + " " + result
						: result
				);

				switch (result) {
					case 'object': 	extendedResult = 'object-literal'; 	break;
					case 'map': 	extendedResult = 'map tupple'; 		break;
				};

				return option.startsWith('a')
					? extendedResult.split(' ')
					: extendedResult;

			} else throw new Error("Unrecognized option: ", typeof option, option)
		}

	} catch (error) {
		const nullOrUndefined = val === null
			? 'null'
			: typeof val === 'undefined'
				? 'undefined'
				: console.error("tc Error. Got:", val, error);
		return !type
			? nullOrUndefined
			: caseis('null') ? val === null
				: caseis('undefined') ? typeof val === 'undefined'
					: console.error("tc Error. Got:", val, error)
	}
}

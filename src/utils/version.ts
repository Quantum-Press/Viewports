
/**
 * Compares two version numbers in the format "x.y.z".
 *
 * @param {string} v1 - First version number.
 * @param {string} v2 - Second version number.
 *
 * @returns {number} - Returns `-1` if `v1` is older than `v2`, `1` if `v1` is newer than `v2`, and `0` if they are equal.
 *
 * @example
 * console.log(versionCompare("1.0", "1.1")); // -1
 * console.log(versionCompare("1.2.0", "1.2")); // 0
 * console.log(versionCompare("1.3", "1.2")); // 1
 */
export const versionCompare = ( v1: string, v2: string ) : number => {
	const parts1 = v1.split( '.' ).map( Number );
	const parts2 = v2.split( '.' ).map( Number );

	for( let i = 0; i < Math.max( parts1.length, parts2.length ); i++ ) {
		const num1 = parts1[ i ] || 0;
		const num2 = parts2[ i ] || 0;

		if( num1 > num2 ) return 1;
		if( num1 < num2 ) return -1;
	}

	return 0;
}


/**
 * Compares two version numbers using an operator.
 *
 * @param {string} v1 - First version number.
 * @param {string} v2 - Second version number.
 * @param {string} operator - Comparison operator (`">"`, `"<"`, `">="`, `"<="`, `"=="`, `"!="`).
 *
 * @returns {boolean} - Returns `true` if the condition is met, otherwise `false`.
 *
 * @throws {Error} - Throws an error if an invalid operator is provided.
 *
 * @example
 * console.log(versionCompareWithOperator("1.2", "1.1", ">")); // true
 * console.log(versionCompareWithOperator("1.0", "1.0", "==")); // true
 * console.log(versionCompareWithOperator("2.0", "2.1", "<")); // true
 */
export const versionCompareWithOperator = ( v1: string, v2: string, operator: string ): boolean => {
	const result = versionCompare( v1, v2 );

	switch( operator ) {
		case '>': return result > 0;
		case '<': return result < 0;
		case '>=': return result >= 0;
		case '<=': return result <= 0;
		case '==': return result === 0;
		case '!=': return result !== 0;
		default: throw new Error( "Invalid operator" );
	}
}

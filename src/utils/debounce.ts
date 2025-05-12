/**
 * Debounces a function call by delaying its execution until after a specified delay period.
 * Useful for rate-limiting events like window resizing, keypresses, etc.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay time in milliseconds to wait before calling the function.
 *
 * @returns {Function} - A debounced version of the provided function.
 *
 * @example
 * const debouncedFunction = debounce( myFunction, 300 );
 * window.addEventListener( 'resize', debouncedFunction );
 */
export function debounce(
	func: Function,
	delay: number
): ( ... args: any[] ) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return function ( ...args: any[] ): void {
		clearTimeout( timeoutId );

		timeoutId = setTimeout( () => {
			func.apply( this, args );
		}, delay );
	};
}

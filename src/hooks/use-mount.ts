const {
	element: {
		useEffect,
		useRef,
	},
} = window[ 'wp' ];


/**
 * React Hook: useMount
 *
 * Executes a given effect function only once when the component is mounted.
 * This hook mimics `componentDidMount` and ensures that the effect runs exactly
 * once, even in React Strict Mode or with repeated renders.
 *
 * If the effect returns a cleanup function, it will be called automatically
 * when the component unmounts.
 *
 * @param {() => void | (() => void)} effect - The function to execute on mount.
 *
 * @returns {void}
 *
 * @example
 * useMount( () => {
 *   console.log( 'Component mounted.' );
 *
 *   return () => {
 *     console.log( 'Component unmounted.' );
 *   };
 * } );
 */
export function useMount(
	effect: () => void | ( () => void )
): void {
	const hasMountedRef = useRef( false );

	useEffect( () => {
		if( hasMountedRef.current ) return;

		hasMountedRef.current = true;

		const cleanup = effect();

		return () => {
			if( typeof cleanup === 'function' ) {
				cleanup();
			}
		};
	}, [] );
}

export default useMount;

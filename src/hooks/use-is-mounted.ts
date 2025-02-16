const {
	element: {
		useEffect,
		useRef,
		useCallback,
	}
} = window[ 'wp' ];


/**
 * Set function to export use is mounted hook.
 */
export function useIsMounted() : () => boolean {
	const isMounted = useRef( false );

	// Set useEffect to handle mount and unmount.
	useEffect( () => {
		isMounted.current = true

		return () => {
			isMounted.current = false
		}
	}, [] );

	// Return callback for getting the current state.
	return useCallback( () => isMounted.current, [] )
}

export default useIsMounted;

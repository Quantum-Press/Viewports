const {
	element: {
		useEffect,
		useRef,
		useCallback,
	}
} = window[ 'wp' ];

export function useIsMounted(): () => boolean {
	const isMounted = useRef( false );

	useEffect( () => {
		isMounted.current = true

		return () => {
			isMounted.current = false
		}
	}, [] );

	return useCallback( () => isMounted.current, [] )
}

export default useIsMounted;

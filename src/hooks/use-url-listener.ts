const {
	element: {
		useEffect,
		useState,
	},
} = window[ 'wp' ];


/**
 * React Hook: useUrlListener
 *
 * Tracks the current browser URL and updates state whenever the URL changes.
 * This includes navigation changes triggered via `pushState`, `replaceState`,
 * or native browser actions like back/forward buttons.
 *
 * React components using this hook will re-render automatically
 * whenever the URL changes, enabling dynamic response to routing
 * without relying on external routing libraries.
 *
 * @returns {string} - The current URL (`window.location.href`).
 *
 * @example
 * const currentURL = useUrlListener();
 * console.log( currentURL );
 */
export function useUrlListener(): string {
	const [ currentURL, setCurrentURL ] = useState( window.location.href );

	useEffect( () => {
		/**
		 * Updates the state with the current location.
		 */
		const handleURLChange = (): void => {
			setCurrentURL( window.location.href );
		};

		/**
		 * Monkey-patches a History API method to emit a custom 'locationchange' event.
		 *
		 * This allows the hook to detect navigation events triggered via
		 * `pushState` or `replaceState`, which do not emit native events.
		 *
		 * @param { 'pushState' | 'replaceState' } method - The history method to patch.
		 */
		const patchHistoryMethod = (
			method: 'pushState' | 'replaceState'
		): void => {
			const original = history[ method ];

			history[ method ] = function ( ...args: any[] ): any {
				const result = original.apply( this, args );
				window.dispatchEvent( new Event( 'locationchange' ) );
				return result;
			};
		};

		patchHistoryMethod( 'pushState' );
		patchHistoryMethod( 'replaceState' );

		window.addEventListener( 'popstate', handleURLChange );
		window.addEventListener( 'locationchange', handleURLChange );

		return () => {
			window.removeEventListener( 'popstate', handleURLChange );
			window.removeEventListener( 'locationchange', handleURLChange );
		};
	}, [] );

	return currentURL;
}

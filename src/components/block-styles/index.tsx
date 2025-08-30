import { gutenbergVersionCompare } from '@viewports/config';
import { useEditorContext } from '@viewports/hooks';

const {
	components: {
		createSlotFill
	},
	data: {
		useSelect
	},
	element: {
		createPortal,
		useEffect,
		useRef,
		useState
	},
} = window[ 'wp' ];

const {
	Fill,
	Slot
} = createSlotFill( 'BlockStyleSlot' );


/**
 * React component: BlockStyles
 *
 * Handles the injection of CSS styles into the editor's document head or iframe container
 * based on the active editor context.
 *
 * This component manages the dynamic loading and updating of block-specific styles,
 * and synchronizes them with the current editor environment, whether that's the
 * site editor or post editor.
 *
 * It monitors the editor context and determines the appropriate container (head or iframe)
 * to inject the styles into, ensuring styles are applied in the correct scope.
 *
 * @returns {JSX.Element | null} - A JSX element that injects the CSS styles into the appropriate location,
 *                                or null if no valid context or container is found.
 *
 * @example
 * // Example usage:
 * <BlockStyles />
 */
export const BlockStyles = (): JSX.Element | null => {

	// States and refs for managing the editor's DOM elements.
	const [ documentHead, setDocumentHead ] = useState<HTMLElement | null>( null );
	const [ iframeContainer, setIframeContainer ] = useState<HTMLElement | null>( null );
	const styleRef = useRef<HTMLStyleElement | null>( null );
	const lastCSS = useRef<string>( '' );

	// Retrieves the current editor context from the hook.
	const editorContext = useEditorContext();

	// Selects the editor mode from the global store.
	const { editorMode } = useSelect( ( select ) => ( {
		editorMode: select( 'core/editor' ).getEditorMode(),
	} ) );

	useEffect( () => {
		let observer: MutationObserver | null = null;

		/**
		 * Finds the iframe element used by the site editor and stores it in state.
		 *
		 * @returns {boolean} - True if the iframe was found and set, false otherwise.
		 */
		const findAndSetIframe = (): boolean => {
			const iframe = document.querySelector( 'iframe[name="editor-canvas"]' ) as HTMLIFrameElement;

			if( iframe ) {
				setIframeContainer( iframe );
				return true;
			}

			setIframeContainer( null );
			return false;
		};

		// Monitors the DOM for changes based on the editor context.
		if( editorContext.context === 'site-editor-edit' || editorContext.context === 'template-editor' ) {
			observer = new MutationObserver( () => {
				const found = findAndSetIframe();
				if( found ) observer?.disconnect();
			} );

			observer.observe( document.body, { childList: true, subtree: true } );
			findAndSetIframe();

		} else if( editorContext.context === 'post-editor' ) {
			const versionCompare = gutenbergVersionCompare( '20.4' );

			if( null !== versionCompare && -1 < gutenbergVersionCompare( '20.4' ) ) {
				observer = new MutationObserver( () => {
					const found = findAndSetIframe();
					if( found ) observer?.disconnect();
				} );

				observer.observe( document.body, { childList: true, subtree: true } );

			} else {
				// Older Gutenberg editors inject directly into <head>
				setDocumentHead( document.head );
			}

		} else {
			setIframeContainer( null );
			setDocumentHead( null );
		}

		// Cleanup the observer when component unmounts or when editor context changes.
		return () => observer?.disconnect();
	}, [ editorContext, editorMode ] );

	// If no valid container (head or iframe) is found, return null.
	if( ! documentHead && ! iframeContainer ) return null;

	return (
		<Slot>
			{ ( fills ) => {
				const combinedCSS = fills
					.map( ( fill ) => fill ?? '' )
					.filter( Boolean )
					.join( '\n' );

				useEffect( () => {
					// Update the style tag content only when combined CSS changes.
					if( styleRef.current && combinedCSS !== lastCSS.current ) {
						styleRef.current.textContent = combinedCSS;
						lastCSS.current = combinedCSS;
					}
				}, [ combinedCSS ] );

				// Determine the target document for the style injection (iframe or document head).
				const target = iframeContainer?.contentDocument?.head ?? (
					documentHead?.isConnected ? documentHead : null
				);

				// If no valid target, return null.
				if( ! target ) return null;

				// Inject the style element into the target document.
				return createPortal(
					<style id="qp-viewports-block-styles" ref={ styleRef } />,
					target
				);
			} }
		</Slot>
	);
};

/**
 * Exported components for use in the context of injecting styles into the editor.
 */
export {
	Fill as StyleFill,
	Slot as StyleSlot
};

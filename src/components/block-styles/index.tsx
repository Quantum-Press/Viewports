import { gutenbergVersionCompare } from '../../config';
import { useEditorContext } from '../../hooks';
import { STORE_NAME } from '../../store';

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
} = window['wp'];

const { Fill, Slot } = createSlotFill('BlockStyleSlot');

export const BlockStyles = () => {
	const [ documentHead, setDocumentHead ] = useState<HTMLElement | null>( null );
	const [ iframeContainer, setIframeContainer ] = useState<HTMLElement | null>( null );
	const styleRef = useRef<HTMLStyleElement | null>( null );
	const lastCSS = useRef<string>( '' );
	const editorContext = useEditorContext();

	const { editorMode } = useSelect( ( select ) => ( {
		editorMode: select( 'core/editor' ).getEditorMode(),
	} ) );

	useEffect( () => {
		let observer: MutationObserver | null = null;

		const findAndSetIframe = () => {
			const iframe = document.querySelector( 'iframe[name="editor-canvas"]' ) as HTMLIFrameElement;
			if( iframe ) {
				setIframeContainer( iframe );
				return true;
			}

			setIframeContainer( null );
			return false;
		};

		if( [ 'site-editor-edit', 'template-editor' ].includes( editorContext.context ) ) {
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
				setDocumentHead( document.head ); // This will be dynamic in any WP version.
			}

		} else {
			setIframeContainer( null );
			setDocumentHead( null );
		}

		return () => observer?.disconnect();
	}, [ editorContext, editorMode ] );

	// console.log( 'renderBlockStyles', editorContext, documentHead, iframeContainer );

	if( ! documentHead && ! iframeContainer ) return null;

	return (
		<Slot>
			{ ( fills ) => {
				const combinedCSS = fills
					.map( ( fill ) => fill ?? '')
					.filter( Boolean )
					.join('\n');

				useEffect( () => {
					if (
						styleRef.current &&
						combinedCSS !== lastCSS.current
					) {
						styleRef.current.textContent = combinedCSS;
						lastCSS.current = combinedCSS;
					}
				}, [ combinedCSS ] );

				const target = iframeContainer?.contentDocument?.head ?? ( documentHead?.isConnected ? documentHead : null );
				if ( ! target) return null;

				return createPortal(
					<style id="qp-viewports-block-styles" ref={ styleRef } />,
					target
				);
			}}
		</Slot>
	);
};

export { Fill as StyleFill, Slot as StyleSlot };

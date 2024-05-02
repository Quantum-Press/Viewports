import { scrollParent } from '../utils';
import useHighlight from './use-highlight';

const {
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];


/**
 * Set function to open sidebar if not already opened.
 *
 * @since 0.2.4
 */
function openSidebar() {
	const element = document.querySelector( 'button[aria-controls="edit-site:template"], button[aria-controls="edit-post:document"], button[aria-controls="edit-post:block"]' );

	if( element && 'false' === element.getAttribute( 'aria-pressed' ) ) {
		element.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );
	}
}


/**
 * Set function to open general tab if not already opened.
 *
 * @since 0.2.4
 */
function openSettingsTab() {
	const element = document.querySelector( '.block-editor-block-inspector__tabs button[aria-controls$="-settings-view"]' );

	if( element && 'false' === element.getAttribute( 'aria-selected' ) ) {
		element.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );
	}
}


/**
 * Set function to open styles tab if not already opened.
 *
 * @since 0.2.4
 */
function openStylesTab() {
	const element = document.querySelector( '.block-editor-block-inspector__tabs button[aria-controls$="-styles-view"]' );

	if( element && 'false' === element.getAttribute( 'aria-selected' ) ) {
		element.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );
	}
}


/**
 * Set function to return highlight sidebar hook.
 *
 * @since 0.2.4
 */
export function useHighlightSidebar() {

	// Set initial state.
	const [ viewport, setViewport ] = useState( false );

	// Set highlight state.
	const [ highlight, setHighlight ] = useHighlight();

	// Set useEffect to handle $element changes.
	useEffect( () => {
		if( ! viewport ) {
			return;
		}

		// Open sidebar first.
		openSidebar();

		// Open styles or general tab.
		if( 1 === 1 ) {
			openStylesTab();
		} else {
			openSettingsTab();
		}

		// Set selector.
		const selector = '.dimensions-block-support-panel';

		// Set element to highlight.
		setHighlight( selector );
		setViewport( false );
	}, [ viewport ] );

	// Return setter.
	return [ viewport, setViewport ];
};

export default useHighlightSidebar;

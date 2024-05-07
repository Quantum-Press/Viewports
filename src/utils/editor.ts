/**
 * Set function to return editor document node depending on editor.
 *
 * @since 0.1.0
 *
 * @return {object} node document
 */
export const getEditorHead = () : object => {
	if ( isSiteEditor() ) {
		const iframe = document.querySelector( 'iframe[name="editor-canvas"]' ) as HTMLIFrameElement;

		return iframe.contentWindow.document.head;
	}

	return document.head;
}


/**
 * Set function to indicate whether we are in site-editor
 *
 * @since 0.1.0
 *
 * @return {boolean} indication
 */
export const isSiteEditor = () : boolean => {
	if ( 'site-editor' === window[ 'pagenow' ] ) {
		return true;
	}

	return false;
}


/**
 * Set function to return version.
 *
 * @since 0.1.0
 *
 * @return {string} version
 */
export const getVersion = () : string => {
	const script = document.getElementById( 'qp-viewports-scripts-js' ) as HTMLScriptElement;
	const parts = script.src.split( '?' );
	const params = new URLSearchParams( '?' + parts[1] );

	return params.get( 'ver' );
}


/**
 * Set function to open sidebar if not already opened.
 *
 * @since 0.2.5
 */
export const openSidebar = () => {
	const element = document.querySelector( 'button[aria-controls="edit-site:template"], button[aria-controls="edit-post:document"], button[aria-controls="edit-post:block"]' );

	if( element && 'false' === element.getAttribute( 'aria-pressed' ) ) {
		element.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );
	}
}


/**
 * Set function to open general tab if not already opened.
 *
 * @since 0.2.5
 */
export const openSettingsTab = () => {
	const element = document.querySelector( '.block-editor-block-inspector__tabs button[aria-controls$="-settings-view"]' );

	if( element && 'false' === element.getAttribute( 'aria-selected' ) ) {
		element.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );
	}
}


/**
 * Set function to open styles tab if not already opened.
 *
 * @since 0.2.5
 */
export const openStylesTab = () => {
	const element = document.querySelector( '.block-editor-block-inspector__tabs button[aria-controls$="-styles-view"]' );

	if( element && 'false' === element.getAttribute( 'aria-selected' ) ) {
		element.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );
	}
}

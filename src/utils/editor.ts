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


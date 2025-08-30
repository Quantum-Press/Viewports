import { useURLListener } from '@viewports/hooks';

const {
	element: {
		useEffect,
		useState,
	},
} = window[ 'wp' ];


/**
 * Represents the available editor contexts within WordPress admin.
 */
export type EditorContext = {
	context:
		| 'post-editor'
		| 'site-editor-start'
		| 'site-editor-edit'
		| 'site-editor-templates'
		| 'site-editor-pages'
		| 'site-editor-patterns'
		| 'site-editor-navigation'
		| 'site-editor-styles'
		| 'template-editor'
		| 'patterns'
		| 'unknown',
	postParam: string,
};


/**
 * Extracts the value of a specific query parameter from the current URL.
 *
 * @param {string} param - The name of the query parameter to retrieve.
 *
 * @returns {string | null} - The value of the query parameter, or null if not found.
 */
function getQueryParam(
	param: string
): string | null {
	const urlParams = new URLSearchParams( window.location.search );

	return urlParams.get( param );
}


/**
 * React Hook: useEditorContext
 *
 * Determines the current editing context based on the browser's URL.
 * Useful for adapting UI or behavior depending on which WordPress editor or
 * admin screen the user is currently on.
 *
 * Automatically updates when the URL changes.
 *
 * @returns {EditorContext} - An object containing the detected editor context and post parameter.
 *
 * @example
 * const { context, postParam } = useEditorContext();
 * if ( context === 'post-editor' ) {
 *   console.log( 'Editing post with ID:', postParam );
 * }
 */
export function useEditorContext(): EditorContext {
	const [ context, setContext ] = useState<EditorContext[ 'context' ]>( 'unknown' );
	const [ postParam, setPostParam ] = useState( '' );
	const url = useURLListener();

	useEffect( () => {
		const path = window.location.pathname;
		const rawPostParam = decodeURIComponent( getQueryParam( 'p' ) || '' );
		const canvasParam = getQueryParam( 'canvas' );

		setPostParam( rawPostParam );

		if ( path.includes( '/wp-admin/site-editor.php' ) ) {
			if ( canvasParam === 'edit' ) {
				setContext( 'site-editor-edit' );
				return;
			}

			switch ( rawPostParam ) {
				case '/template':
					setContext( 'site-editor-templates' );
					break;
				case '/page':
					setContext( 'site-editor-pages' );
					break;
				case '/pattern':
					setContext( 'site-editor-patterns' );
					break;
				case '/navigation':
					setContext( 'site-editor-navigation' );
					break;
				case '/styles':
					setContext( 'site-editor-styles' );
					break;
				default:
					setContext( 'site-editor-start' );
			}

		} else if (
			path.includes( '/wp-admin/post.php' ) ||
			path.includes( '/wp-admin/post-new.php' )
		) {
			setContext( 'post-editor' );

		} else if (
			path.includes( '/wp-admin/edit.php' ) &&
			window.location.search.includes( 'post_type=wp_template' )
		) {
			setContext( 'template-editor' );

		} else if (
			path.includes( '/wp-admin/edit.php' ) &&
			window.location.search.includes( 'post_type=wp_block' )
		) {
			setContext( 'patterns' );

		} else {
			setContext( 'unknown' );
		}
	}, [ url ] );

	return {
		context,
		postParam,
	};
}

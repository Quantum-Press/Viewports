import { isSiteEditor } from './utils/editor';
import { STORE_NAME } from './store/constants';

const {
	data: {
		select,
	},
} = window[ 'wp' ];

/**
 * Set function const to export iframe handler.
 *
 * @since 0.1.0
 */
const iframeHandler = () => {

	// Set store states.
	const store = select( STORE_NAME );
	const isActive = store.isActive();
	const viewport = store.getViewport();

	// Set maxWidth and maxHeight to calculate zoom.
	const $ui = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container, .edit-post-visual-editor .is-desktop-preview, .edit-post-visual-editor__content-area .is-desktop-preview' );
	const maxWidth = $ui ? $ui.getBoundingClientRect().width : 0;

	const $uiWrap = document.querySelector( '.edit-site-visual-editor, .edit-post-visual-editor .is-desktop-preview, .edit-post-visual-editor__content-area' );
	const maxHeight = $uiWrap ? $uiWrap.getBoundingClientRect().height : 0;


	/**
	 * Set function to calculate sizes based on iframe.
	 *
	 * @since 0.1.0
	 */
	const calculateIframeSize = () => {
		const iframe = document.querySelector( 'iframe[name="editor-canvas"], .editor-styles-wrapper' ) as HTMLElement;

		if ( isActive ) {
			if ( viewport > maxWidth ) {
				const factorSmaller = ( maxWidth - 80 ) / viewport;
				const factorGreater = viewport / ( maxWidth - 80 );

				iframe.style.margin = '40px';
				iframe.style.width = viewport + 'px';
				iframe.style.height = ( maxHeight * factorGreater ) - ( ( 145 + 45 ) * factorGreater ) + 'px';
				iframe.style.transform = 'scale(' + factorSmaller + ')';

				if ( isSiteEditor() ) {
					iframe.style.transformOrigin = 'top left';
				} else {
					iframe.style.transformOrigin = 'top center';
				}

			} else {
				iframe.style.margin = '40px auto';
				iframe.style.width = viewport + 1 + 'px';
				iframe.style.height = ( maxHeight - 140 - 45 ) + 'px';
				iframe.style.transform = 'scale(1)';
				iframe.style.transformOrigin = 'top center';
			}
		} else {
			iframe.style.margin = '0';
			iframe.style.width = '100%';
			iframe.style.height = '100%';
			iframe.style.transform = 'scale(1)';
		}
	}

	calculateIframeSize();
}

export default iframeHandler;

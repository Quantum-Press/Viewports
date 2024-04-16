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


	/**
	 * Set function to calculate sizes for site or post editor.
	 *
	 * @since 0.1.0
	 */
	const calculateIframeSize = () => {
		if ( isSiteEditor() ) {
			calculateSiteEditorSize();
		} else {
			calculatePostEditorSize();
		}
	}


	/**
	 * Set function to calculate siteEditor size.
	 *
	 * @since 0.1.7
	 */
	const calculateSiteEditorSize = () => {

		// Set maxWidth.
		const $widthContainer = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container' ) as HTMLElement;
		const maxWidth = $widthContainer ? $widthContainer.getBoundingClientRect().width : 0;

		const $heightContainer = document.querySelector( '.edit-site-visual-editor' ) as HTMLElement;
		const maxHeight = $heightContainer ? $heightContainer.getBoundingClientRect().height : 0;

		if( ! $widthContainer || ! $heightContainer ) {
			return;
		}

		const $iframe = document.querySelector( 'iframe[name="editor-canvas"], .edit-site-editor-canvas-container' ) as HTMLElement;

		if ( isActive ) {
			if ( viewport > ( maxWidth - 80 ) ) {
				const factorSmaller = ( maxWidth - 80 ) / viewport;
				const factorGreater = viewport / ( maxWidth - 80 );

				$iframe.style.width = viewport + 'px';
				$iframe.style.height = ( ( maxHeight - 45 ) * factorGreater ) + 'px';

				$widthContainer.style.height = ( maxHeight - 45 ) + 'px';

				$iframe.style.margin = '40px';
				$iframe.style.transform = 'scale(' + factorSmaller + ')';
				$iframe.style.transformOrigin = 'top left';

			} else {
				$iframe.style.width = viewport + 1 + 'px';
				$iframe.style.height = ( maxHeight - 45 ) + 'px';

				$widthContainer.style.height = ( maxHeight - 45 ) + 'px';

				$iframe.style.margin = '40px auto';
				$iframe.style.transform = 'scale(1)';
				$iframe.style.transformOrigin = 'top center';
			}
		} else {
			$iframe.style.width = '100%';
			$iframe.style.height = '100%';

			$widthContainer.style.height = ( maxHeight ) + 'px';

			$iframe.style.margin = '0';
			$iframe.style.transform = 'scale(1)';
		}
	}


	/**
	 * Set function to calculate postEditor size.
	 *
	 * @since 0.1.7
	 */
	const calculatePostEditorSize = () => {
		const $metaBoxes = document.querySelector( '.edit-post-layout__metaboxes .meta-box-sortables > div' );
		const hasMetaBoxes = $metaBoxes ? true : false;

		const $desktopPreviewContainer =  document.querySelector( '.edit-post-visual-editor .is-desktop-preview, .edit-post-visual-editor__content-area .is-desktop-preview' ) as HTMLElement;
		const maxWidth = $desktopPreviewContainer ? $desktopPreviewContainer.getBoundingClientRect().width - 80 : 0;

		const $contentContainer = document.querySelector( '.edit-post-visual-editor, .edit-post-visual-editor__content-area' ) as HTMLElement;
		const maxHeight = $contentContainer ? $contentContainer.getBoundingClientRect().height : 0;

		if( ! $desktopPreviewContainer || ! $contentContainer ) {
			return;
		}

		const $iframe = document.querySelector( 'iframe[name="editor-canvas"], .editor-styles-wrapper' ) as HTMLElement;

		if ( isActive ) {
			if ( viewport >= maxWidth ) {
				const factorSmaller = ( maxWidth ) / viewport;
				const factorGreater = viewport / ( maxWidth );

				$iframe.style.width = viewport + 'px';

				let newHeight = ( maxHeight - ( 101 + 80 ) );

				$iframe.style.height = newHeight * factorGreater + 'px';
				$desktopPreviewContainer.style.height = newHeight + 'px';

				$iframe.style.margin = '40px';
				$iframe.style.transform = 'scale(' + factorSmaller + ')';
				$iframe.style.transformOrigin = 'top center';

			} else {
				$iframe.style.width = viewport + 1 + 'px';

				let newHeight = ( maxHeight - ( 101 + 80 ) );

				$iframe.style.height = newHeight + 'px';
				$desktopPreviewContainer.style.height = newHeight + 'px';

				$iframe.style.margin = '40px auto';
				$iframe.style.transform = 'scale(1)';
				$iframe.style.transformOrigin = 'top center';
			}
		} else {
			$iframe.style.width = '100%';
			$iframe.style.height = maxHeight + 'px';

			if( $contentContainer ) {
				$contentContainer.style.height = 'auto';
			} else {
				$desktopPreviewContainer.style.height = 'auto';
			}

			$iframe.style.margin = '0';
			$iframe.style.transform = 'scale(1)';
		}
	}

	calculateIframeSize();
}

export default iframeHandler;

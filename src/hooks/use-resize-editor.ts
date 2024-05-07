
import { STORE_NAME } from '../store';
import { isSiteEditor } from '../utils';
import { useResizeObserver } from './';

const {
	data: {
		dispatch,
		useSelect,
	},
	element: {
		useEffect,
	}
} = window[ 'wp' ];

/**
 * Set function const to export resize editor hook.
 * Important! It should only be used once! Actually in wrap component.
 *
 * @since 0.2.4
 */
export const useResizeEditor = () => {

	// Set resize states.
	const resizeSkeleton = useResizeObserver( {
		selector: '.interface-interface-skeleton__content',
		box: 'border-box',
	} );
	const resizeEditor = useResizeObserver( {
		selector: 'iframe[name="editor-canvas"], .editor-styles-wrapper, .edit-site-editor-canvas-container',
		box: 'border-box',
	} );

	const resizeWrap = useResizeObserver( {
		selector: '.edit-post-visual-editor, .edit-site-visual-editor',
		box: 'border-box',
	} );

	// Set store dependencies.
	const {
		isActive,
		viewport,
	} = useSelect( select => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			viewport: store.getViewport(),
		}
	} );

	// Set useEffect to recalculate sizes.
	useEffect( () => {
		if ( isSiteEditor() ) {
			calculateSiteEditorSize();
		} else {
			calculatePostEditorSize();
		}

		dispatch( STORE_NAME ).setIframeSize( resizeEditor );

	}, [ resizeSkeleton, resizeEditor ] );


	/**
	 * Set function to calculate siteEditor size.
	 *
	 * @since 0.2.4
	 */
	const calculateSiteEditorSize = () => {

		// Set maxWidth.
		const $widthContainer = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container' ) as HTMLElement;
		const maxWidth = $widthContainer ? $widthContainer.getBoundingClientRect().width : 0;

		// Set maxHeight.
		const $heightContainer = document.querySelector( '.edit-site-visual-editor' ) as HTMLElement;
		const maxHeight = $heightContainer ? $heightContainer.getBoundingClientRect().height : 0;

		// Check validity.
		if( ! $widthContainer || ! $heightContainer ) {
			return;
		}

		// Set iframe element.
		const $iframe = document.querySelector( 'iframe[name="editor-canvas"], .edit-site-editor-canvas-container' ) as HTMLElement;

		// Check if we need to set active viewport.
		if ( isActive ) {
			if ( viewport > ( maxWidth - 80 ) ) {

				// Set factors.
				const factorSmaller = ( maxWidth - 80 ) / viewport;
				const factorGreater = viewport / ( maxWidth - 80 );

				// Set viewport size with scaling.
				$iframe.style.width = viewport + 'px';
				$iframe.style.height = ( ( maxHeight - 80 ) * factorGreater ) + 'px';

				$widthContainer.style.height = ( maxHeight - 45 ) + 'px';

				// Set positioning.
				$iframe.style.margin = '40px';
				$iframe.style.transform = 'scale(' + factorSmaller + ')';
				$iframe.style.transformOrigin = 'top left';

			} else {

				// Set viewport size without scaling.
				$iframe.style.width = viewport + 1 + 'px';
				$iframe.style.height = ( maxHeight - 80 ) + 'px';

				$widthContainer.style.height = ( maxHeight - 45 ) + 'px';

				// Set positioning.
				$iframe.style.margin = '40px auto';
				$iframe.style.transform = 'scale(1)';
				$iframe.style.transformOrigin = 'top center';
			}
		} else {

			// Reset sizes.
			$iframe.style.width = '100%';
			$iframe.style.height = '100%';

			$widthContainer.style.height = ( maxHeight ) + 'px';

			// Reset position.
			$iframe.style.margin = '0';
			$iframe.style.transform = 'scale(1)';
		}
	}


	/**
	 * Set function to calculate postEditor size.
	 *
	 * @since 0.2.4
	 */
	const calculatePostEditorSize = () => {

		// Set metaboxes indicator.
		const $metaBoxes = document.querySelector( '.edit-post-layout__metaboxes .meta-box-sortables > div' );
		const hasMetaBoxes = $metaBoxes ? true : false;

		// Set maxWidth.
		const $desktopPreviewContainer =  document.querySelector( '.edit-post-visual-editor__content-area .is-desktop-preview, .edit-post-visual-editor > div:first-child:last-child' ) as HTMLElement;
		const maxWidth = $desktopPreviewContainer ? $desktopPreviewContainer.getBoundingClientRect().width - 80 : 0;

		// Set maxHeight.
		const $contentContainer = document.querySelector( '.edit-post-visual-editor, .edit-post-visual-editor__content-area' ) as HTMLElement;
		const maxHeight = $contentContainer ? $contentContainer.getBoundingClientRect().height : 0;

		// Check validity.
		if( ! $desktopPreviewContainer || ! $contentContainer ) {
			return;
		}

		// Set iframe element.
		const $iframe = document.querySelector( 'iframe[name="editor-canvas"], .editor-styles-wrapper' ) as HTMLElement;

		// Check if we need to set active viewport.
		if ( isActive ) {
			if ( viewport >= maxWidth ) {

				// Set factors.
				const factorSmaller = ( maxWidth ) / viewport;
				const factorGreater = viewport / ( maxWidth );

				// Set viewport size with scaling.
				$iframe.style.width = viewport + 'px';

				let newHeight = ( maxHeight - ( 101 + 80 ) );

				$iframe.style.height = newHeight * factorGreater + 'px';
				$desktopPreviewContainer.style.height = newHeight + 'px';

				// Set positioning.
				$iframe.style.margin = '40px';
				$iframe.style.transform = 'scale(' + factorSmaller + ')';
				$iframe.style.transformOrigin = 'top center';

			} else {

				// Set viewport size without scaling.
				$iframe.style.width = viewport + 1 + 'px';

				let newHeight = ( maxHeight - ( 101 + 80 ) );

				$iframe.style.height = newHeight + 'px';
				$desktopPreviewContainer.style.height = newHeight + 'px';

				// Set positioning.
				$iframe.style.margin = '40px auto';
				$iframe.style.transform = 'scale(1)';
				$iframe.style.transformOrigin = 'top center';
			}
		} else {

			// Reset sizes.
			$iframe.style.width = '100%';
			$iframe.style.height = maxHeight + 'px';

			if( $contentContainer ) {
				$contentContainer.style.height = 'auto';
			} else {
				$desktopPreviewContainer.style.height = 'auto';
			}

			// Reset position.
			$iframe.style.margin = '0';
			$iframe.style.transform = 'scale(1)';
		}
	}

	return [ resizeEditor, resizeSkeleton ];
}

export default useResizeEditor;

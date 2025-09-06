
import { STORE_NAME } from '../store';
import { isSiteEditor } from '../utils';
import { useResizeObserver, useDeviceType } from './';

const {
	data: {
		useDispatch,
		useSelect,
	},
	element: {
		useState,
		useEffect,
		useLayoutEffect,
	}
} = window[ 'wp' ];

/**
 * Set function const to export resize editor hook.
 * Important! It should only be used once! Actually in wrap component.
 */
export const useResizeEditor = () => {

	// Set resize info
	const [ resizeScale, setResizeScale ] = useState( 1 );

	// Set ignore flag.
	const [ ignore, setIgnore ] = useState( false );

	// Set resize states.
	const resizeSkeleton = useResizeObserver( {
		selector: '.interface-interface-skeleton__content',
		box: 'border-box',
	} );
	const resizeEditor = useResizeObserver( {
		selector: 'iframe[name="editor-canvas"], .editor-styles-wrapper, .edit-site-editor-canvas-container',
		box: 'border-box',
	} );

	// Set passive resize state.
	const resizeWrap = useResizeObserver( {
		selector: '.edit-post-visual-editor, .edit-site-visual-editor',
		box: 'border-box',
	} );

	// Set store dependencies.
	const {
		isActive,
		viewport,
		isReady,
		deviceType,
		postId,
		templateId,
	} = useSelect( select => {
		const store = select( STORE_NAME );
		const editorStore = select( 'core/editor' );

		return {
			isReady: store.isReady(),
			isActive: store.isActive(),
			viewport: store.getViewport(),
			isRegistering: store.isRegistering(),

			deviceType: editorStore.getDeviceType(),
			postId: editorStore.getCurrentPostId(),
			templateId: editorStore.getCurrentTemplateId(),
		}
	} );

	// Set store dispatcher.
	const dispatch = useDispatch( STORE_NAME );

	/**
	 * Set function to calculate siteEditor size.
	 */
	const calculateSiteEditorSize = () => {

		// Set maxWidth.
		const $widthContainer = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container' ) as HTMLElement;
		const maxWidth = $widthContainer ? $widthContainer.getBoundingClientRect().width - 80 : 0;

		// Set maxHeight.
		const $heightContainer = document.querySelector( '.edit-site-visual-editor, .edit-post-visual-editor' ) as HTMLElement;
		const maxHeight = $heightContainer ? $heightContainer.getBoundingClientRect().height : 0;

		// Check validity.
		if( ! $widthContainer || ! $heightContainer ) {
			return;
		}

		// Set iframe element.
		const $iframe = document.querySelector( 'iframe[name="editor-canvas"], .edit-site-editor-canvas-container' ) as HTMLElement;

		// Check if we need to set active viewport.
		if ( isActive ) {
			if ( viewport > maxWidth ) {

				// Set factors.
				const factorSmaller = maxWidth / viewport;
				const factorGreater = viewport / maxWidth;

				// Set viewport size with scaling.
				$iframe.style.width = viewport + 'px';
				$iframe.style.height = ( ( maxHeight - 80 ) * factorGreater ) + 'px';

				$widthContainer.style.height = ( maxHeight - 45 ) + 'px';

				// Set positioning.
				$iframe.style.margin = '40px';
				$iframe.style.transform = 'scale(' + factorSmaller + ')';
				$iframe.style.transformOrigin = 'top center';

				// Update resize scale.
				setResizeScale( factorSmaller );

			} else {

				// Set viewport size without scaling.
				$iframe.style.width = viewport + 1 + 'px';
				$iframe.style.height = ( maxHeight - 80 ) + 'px';

				$widthContainer.style.height = ( maxHeight - 45 ) + 'px';

				// Set positioning.
				$iframe.style.margin = '40px auto';
				$iframe.style.transform = 'scale(1)';
				$iframe.style.transformOrigin = 'top center';

				// Update resize scale.
				setResizeScale( 1 );
			}
		} else {
			if ( 'Desktop' == deviceType ) {
				// Reset sizes.
				$iframe.style.width = '100%';
				$iframe.style.height = '100%';

				$widthContainer.style.height = ( maxHeight ) + 'px';

				// Reset position.
				$iframe.style.margin = '0 auto';
				$iframe.style.transform = null;

				// Update resize scale.
				setResizeScale( 1 );
			}
		}
	}


	/**
	 * Set function to calculate postEditor size.
	 */
	const calculatePostEditorSize = () => {

		// Set metaboxes indicator.
		const $metaBoxes = document.querySelector( '.edit-post-layout__metaboxes .meta-box-sortables > div' );
		const hasMetaBoxes = $metaBoxes ? true : false;

		// Set maxWidth.
		const $desktopPreviewContainer =  document.querySelector( '.edit-post-visual-editor__content-area .is-desktop-preview, .edit-post-visual-editor > div:first-child:last-child' ) as HTMLElement;
		const maxWidth = $desktopPreviewContainer ? $desktopPreviewContainer.getBoundingClientRect().width - 80 : 0;

		// Set widthcontainer.
		const $widthContainer = document.querySelector( '.interface-interface-skeleton__content .components-resizable-box__container' ) as HTMLElement;

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

				let newHeight = ( maxHeight - ( 115 + 80 ) );

				$iframe.style.height = newHeight * factorGreater + 'px';
				$desktopPreviewContainer.style.height = newHeight + 'px';

				// Set positioning.
				$iframe.style.margin = '40px';
				$iframe.style.transform = 'scale(' + factorSmaller + ')';
				$iframe.style.transformOrigin = 'top center';

				// Update resize scale.
				setResizeScale( factorSmaller );

			} else {

				// Set viewport size without scaling.
				$iframe.style.width = viewport + 1 + 'px';

				let newHeight = ( maxHeight - ( 115 + 80 ) );

				$iframe.style.height = newHeight + 'px';
				$desktopPreviewContainer.style.height = newHeight + 'px';

				// Set positioning.
				$iframe.style.margin = '40px auto';
				$iframe.style.transform = 'scale(1)';
				$iframe.style.transformOrigin = 'top center';

				// Update resize scale.
				setResizeScale( 1 );
			}
		} else {
			if ( 'Desktop' == deviceType ) {
				// Reset sizes.
				$iframe.style.width = '100%';
				$iframe.style.height = maxHeight + 'px';

				if( $contentContainer ) {
					$contentContainer.style.height = 'auto';
				} else {
					$desktopPreviewContainer.style.height = 'auto';
				}

				if( $widthContainer ) {
					$widthContainer.style.height = maxHeight + 'px';
				}

				// Reset position.
				$iframe.style.margin = '0 auto';
				$iframe.style.transform = null;

				// Update resize scale.
				setResizeScale( 1 );
			}
		}
	}

	// Set useEffect to recalculate sizes.
	useLayoutEffect( () => {
		if ( isSiteEditor() ) {
			calculateSiteEditorSize();
		} else {
			calculatePostEditorSize();
		}

		// console.log( 'dispatch.setIframeSize', resizeEditor );

		dispatch.setIframeSize( resizeEditor );

	}, [ resizeSkeleton, resizeEditor, templateId, postId, deviceType ] );

	if( ! isReady ) {
		return {
			editor: resizeEditor,
			skeleton: resizeSkeleton,
			scale: resizeScale,
		};
	}

	return {
		editor: resizeEditor,
		skeleton: resizeSkeleton,
		scale: resizeScale,
	};
}

export default useResizeEditor;

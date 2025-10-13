
import { isSiteEditor } from '@quantum-viewports/utils';
import { Wrap, Inspector } from '@quantum-viewports/components';
import portalHandler from './portals';

const {
	data: {
		subscribe,
	},
	domReady,
	element: {
		createRoot,
	}
} = window[ 'wp' ];

const {
	createElement,
} = window[ 'React' ];


// Setup dom elements.
const viewportWrap = document.createElement( 'div' );
viewportWrap.id = 'qp-viewports-wrap';
let viewportRoot : any = false;

const inspectorWrap = document.createElement( 'div' );
inspectorWrap.id = 'qp-viewports-inspector-wrap';
let inspectorRoot : any = false;


/**
 * Subscribe at domReady to implement components as fast as possible.
 */
domReady( () => {

	/**
	 * Subscribe to editor, to load on first init.
	 */
	const unsubscribe = subscribe( () => {
		if ( ! document.querySelector( '.interface-interface-skeleton__content' ) ) {
			return;
		}

		// Instant unsubscribe.
		unsubscribe();

		// Is executed after any editor change.
		const afterEditorChange = () => {

			// Make sure the viewport UI is attached to the DOM.
			if ( ! viewportWrap.isConnected ) {
				if ( isSiteEditor() ) {
					const viewportUI = document.querySelector( '.interface-interface-skeleton__content .edit-site-visual-editor, .interface-interface-skeleton__content .edit-post-visual-editor' );

					if ( viewportUI ) {
						viewportUI.before( viewportWrap );

						if ( ! viewportRoot ) {
							viewportRoot = createRoot( viewportWrap );
							viewportRoot.render( createElement( Wrap ) );
						}
					}
				} else {
					const viewportUI = document.querySelector( '.edit-post-visual-editor__content-area iframe[name="editor-canvas"], .edit-post-visual-editor__content-area .is-desktop-preview, .edit-post-visual-editor > div:first-child:last-child .editor-styles-wrapper, .edit-post-visual-editor > div:first-child:last-child iframe[name="editor-canvas"]' );

					if ( viewportUI ) {
						viewportUI.before( viewportWrap );

						if ( ! viewportRoot ) {
							viewportRoot = createRoot( viewportWrap );
							viewportRoot.render( createElement( Wrap ) );
						}
					}
				}
			}

			// Make sure the viewport UI is attached to the DOM.
			if ( ! inspectorWrap.isConnected ) {
				if ( isSiteEditor() ) {
					const inspectorUI = document.querySelector( '.edit-site-editor__interface-skeleton .interface-interface-skeleton__content, #site-editor .interface-interface-skeleton__content' );

					if ( inspectorUI ) {
						inspectorUI.before( inspectorWrap );

						if ( ! inspectorRoot ) {
							inspectorRoot = createRoot( inspectorWrap );
							inspectorRoot.render( createElement( Inspector ) );
						}
					}
				} else {
					const inspectorUI = document.querySelector( '.edit-post-visual-editor .edit-post-visual-editor__content-area, .edit-post-layout .interface-interface-skeleton__content' );

					if ( inspectorUI ) {
						inspectorUI.before( inspectorWrap );

						if ( ! inspectorRoot ) {
							inspectorRoot = createRoot( inspectorWrap );
							inspectorRoot.render( createElement( Inspector ) );
						}
					}
				}
			}
		}

		// Subscribe to editor changes and call afterEditorChange after the
		// current JS scope is executed.
		let editorUpdateTimeout: any;

		subscribe( () => {
			clearTimeout( editorUpdateTimeout );
			editorUpdateTimeout = setTimeout( afterEditorChange, 1 );
		} );

	} );


	/**
	 * Subscribe to editor, to indicate template change.
	 */
	subscribe( () => {
		portalHandler();
	} );
} );

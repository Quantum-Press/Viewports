import './editor.scss';
import './store/index';
import './register';

import { STORE_NAME } from './store/constants';
import { isSiteEditor } from './utils/editor';
import portalHandler from './portals';
import Wrap from './components/wrap';
import Inspector from './components/inspector';
import ToggleView from './components/toggle-view';

const {
	data: {
		dispatch,
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

const toggleViewWrap = document.createElement( 'div' );
toggleViewWrap.id = 'qp-viewports-toggle-view-wrap';
let toggleRoot : any = false;
let toggleElement : any = false;


/**
 * Wrap our entire component in a IIFE to prevent pollution of the global
 * namespace.
 *
 * @link https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
domReady( () => {

	/**
	 * Subscribe to editor, to load on first init.
	 *
	 * @since 0.1.0
	 */
	const unsubscribe = subscribe( () => {
		if ( ! document.querySelector( '.interface-interface-skeleton__content' ) ) {
			return;
		}

		unsubscribe();

		// Is executed after any editor change.
		const afterEditorChange = () => {

			// Make sure the viewport UI is attached to the DOM.
			if ( ! viewportWrap.isConnected ) {
				if ( isSiteEditor() ) {
					const viewportUI = document.querySelector( '.interface-interface-skeleton__content .edit-site-visual-editor' );

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
					const inspectorUI = document.querySelector( '.edit-site-editor__interface-skeleton .interface-interface-skeleton__content' );

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

			// Make sure the toggle UI is attached to the DOM.
			if ( ! toggleViewWrap.isConnected ) {
				const toggleUI = document.querySelector( '.edit-site-header-edit-mode__end, .edit-post-header__settings' );

				if ( toggleUI ) {
					toggleUI.before( toggleViewWrap );

					if ( ! toggleRoot ) {
						toggleRoot = createRoot( toggleViewWrap );
						toggleElement = createElement( ToggleView );

						toggleRoot.render( toggleElement );
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
	 * Set var to store the latest template id.
	 *
	 * @since 0.1.0
	 */
	let templateId: string | null;


	/**
	 * Subscribe to editor, to indicate template change.
	 *
	 * @since 0.1.0
	 */
	subscribe( () => {
		portalHandler();
	} );
} );

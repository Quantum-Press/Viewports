import './editor.scss';
import './store/index';
import './register';

import { STORE_NAME } from './store/constants';
import { isSiteEditor } from './utils/editor';
import iframeHandler from './iframe';
import portalHandler from './portals';
import Wrap from './components/wrap';
import Sidebar from './components/sidebar';
import Toggle from './components/toggle';

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
viewportWrap.id = 'qp-viewports-ui-wrap';
let viewportRoot : any = false;

const sidebarWrap = document.createElement( 'div' );
sidebarWrap.id = 'qp-viewports-sidebar-ui-wrap';
let sidebarRoot : any = false;

const toggleWrap = document.createElement( 'div' );
toggleWrap.id = 'qp-viewports-toggle-ui-wrap';
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
	 * Set event listening to resize.
	 */
	window.addEventListener( 'resize', () => {
		if ( viewportWrap.isConnected ) {
			iframeHandler();

			viewportRoot.render( createElement( Wrap ) );
		}
	});


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

			// Run iframe handler first.
			iframeHandler();

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
					const viewportUI = document.querySelector( '.edit-post-visual-editor__content-area iframe[name="editor-canvas"], .edit-post-visual-editor__content-area .is-desktop-preview' );

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
			if ( ! sidebarWrap.isConnected ) {
				if ( isSiteEditor() ) {
					const sidebarUI = document.querySelector( '.edit-site-editor__interface-skeleton .interface-interface-skeleton__content' );

					if ( sidebarUI ) {
						sidebarUI.before( sidebarWrap );

						if ( ! sidebarRoot ) {
							sidebarRoot = createRoot( sidebarWrap );
							sidebarRoot.render( createElement( Sidebar ) );
						}
					}
				} else {
					const sidebarUI = document.querySelector( '.edit-post-visual-editor .edit-post-visual-editor__content-area' );

					if ( sidebarUI ) {
						sidebarUI.before( sidebarWrap );

						if ( ! sidebarRoot ) {
							sidebarRoot = createRoot( sidebarWrap );
							sidebarRoot.render( createElement( Sidebar ) );
						}
					}
				}
			}

			// Make sure the toggle UI is attached to the DOM.
			if ( ! toggleWrap.isConnected ) {
				const toggleUI = document.querySelector( '.edit-site-header-edit-mode__end, .edit-post-header__settings' );

				if ( toggleUI ) {
					toggleUI.before( toggleWrap );

					if ( ! toggleRoot ) {
						toggleRoot = createRoot( toggleWrap );
						toggleElement = createElement( Toggle );

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
		const searchParams  = new URLSearchParams( window.location.search );
		const newTemplateId = searchParams.get( 'postId' );

		if ( newTemplateId !== templateId ) {
			templateId = newTemplateId;

			dispatch( STORE_NAME ).clearBlocks();
		}

		portalHandler();
	} );

} );

import { InspectorPortals, IndicatorPortals } from '@viewports/components';

const {
	element: {
		createRoot,
	}
} = window[ 'wp' ];

const {
	createElement,
} = window[ 'React' ];

// Set portal element base.
const portalWrap = document.createElement( 'div' );
portalWrap.id = 'qp-viewports-portal-wrap';
let portalRoot : any = false;


/**
 * Set function const to export portal handler.
 */
const portalHandler = () => {

	// Set portalUI to check.
	const portalUI = document.querySelector( '.edit-site-editor__interface-skeleton .interface-interface-skeleton__content, .edit-post-layout .interface-interface-skeleton__content, .interface-interface-skeleton__content' );

	// Set portalUI into dom to render.
	if ( portalUI ) {
		portalUI.before( portalWrap );

		if ( ! portalRoot ) {
			portalRoot = createRoot( portalWrap );
		}

		portalRoot.render( createElement( Portals ) );
	}
}


/**
 * Set function const to export portals component.
 */
const Portals = () : React.JSX.Element => {
	return (
		<>
			<InspectorPortals />
			<IndicatorPortals />
		</>
	);
}

export default portalHandler;

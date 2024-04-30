import { STORE_NAME } from '../../store/constants';
import Highlight from './highlight';

const {
	data: {
		useSelect,
	},
	element: {
		useLayoutEffect,
		useState,
	}
} = window[ 'wp' ];

/**
 * Set component const to export Highlights UI.
 *
 * @since 0.2.2
 */
const Highlights = () => {

	// Set store states.
	const {
		viewport,
		isLoading,
		isActive,
		isEditing,
		isInspecting,
		inspectorPosition,
	} = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			viewport: store.getViewport(),
			isLoading: store.isLoading(),
			isActive: store.isActive(),
			isEditing: store.isEditing(),
			isInspecting: store.isInspecting(),
			inspectorPosition: store.inspectorPosition(),
		}
	}, [] );

	// Set state.
	const [ observers, setObservers ] = useState( {} );

	// Useffect if we are enable / disable editing viewports.
	useLayoutEffect( () => {
		const update = { ... observers };

		if( isEditing && isActive ) {
			update[ 'editor' ] = {
				selector: 'iframe[name="editor-canvas"], .editor-styles-wrapper',
				type: 'target',
				padding: 10,
			};
		}

		if( ! isEditing && update.hasOwnProperty( 'editor' ) ) {
			delete update[ 'editor' ];
		}

		setObservers( update );
	}, [ isLoading, isActive, isEditing, isInspecting, inspectorPosition ] )

	// Render component.
	return (
		<div className="qp-viewports-highlight-wrap">
			{ Object.entries( observers ).map( ( observer ) => {
				return (
					<Highlight observe={ observer[ 1 ] } />
				);
			} ) }
		</div>
	);
};

export default Highlights;

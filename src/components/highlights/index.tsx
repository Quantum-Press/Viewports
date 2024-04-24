import { STORE_NAME } from '../../store/constants';
import Highlight from './highlight';

const {
	data: {
		useSelect,
	},
	element: {
		useEffect,
		useState,
		useRef,
	}
} = window[ 'wp' ];

// Highlighter component.
const Highlights = () => {

	// Set store states.
	const {
		viewport,
		isActive,
		isEditing,
		isInspecting,
	} = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			viewport: store.getViewport(),
			isActive: store.isActive(),
			isEditing: store.isEditing(),
			isInspecting: store.isInspecting(),
			inspectorPosition: store.inspectorPosition(),
		}
	}, [] );

	// Set state.
	const [ observers, setObservers ] = useState( {} );


	// Useffect if we are enable / disable editing viewports.
	useEffect( () => {
		const update = { ... observers };

		if( isEditing && isActive ) {
			update[ 'editor' ] = {
				selector: 'iframe[name="editor-canvas"], .editor-styles-wrapper',
				type: 'target',
				padding: 20,
			};
		}

		if( ! isEditing && update.hasOwnProperty( 'editor' ) ) {
			delete update[ 'editor' ];
		}

		if( ! isActive && update.hasOwnProperty( 'editor' ) ) {
			delete update[ 'editor' ];
		}

		setObservers( update );
	}, [ isEditing, isActive ] )


	// UseEffect to force redraw on viewport change.
	useEffect( () => {
		setObservers( { ... observers } );
	}, [ viewport, isInspecting ] );


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

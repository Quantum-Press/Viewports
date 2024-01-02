import { STORE_NAME } from '../../store/constants';
import Canvas from './canvas';

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
const Highlighter = () => {

	// Set store states.
	const {
		viewport,
		isEditing,
		isExpanded,
	} = useSelect( ( select: Function ) => {
		const store = select( STORE_NAME );

		return {
			viewport: store.getViewport(),
			isEditing: store.isEditing(),
			isExpanded: store.isExpanded(),
		}
	}, [] );

	// Set state.
	const [ selectors, setSelectors ] = useState( {} );


	// Useffect if we are enable / disable editing viewports.
	useEffect( () => {
		const update = { ... selectors };

		if( isEditing ) {
			update['editor'] = {
				selector: 'iframe[name="editor-canvas"], .editor-styles-wrapper',
				type: 'target',
			};
		}

		if( ! isEditing && update.hasOwnProperty( 'editor' ) ) {
			delete update['editor'];
		}

		setSelectors( update );
	}, [ isEditing ] )


	// UseEffect to force redraw on viewport change.
	useEffect( () => {
		setSelectors( { ... selectors } );
	}, [ viewport, isExpanded ] );


	return (
		<Canvas selectors={ selectors } />
	);
};


export default Highlighter;

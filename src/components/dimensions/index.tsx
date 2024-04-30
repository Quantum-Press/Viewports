import Position from './position';
import Margin   from './margin';
import Border   from './border';
import Padding  from './padding';
import Content  from './content';

/**
 * Imports wp ressources.
 */
const {
	data: {
		useSelect,
	},
} = window[ 'wp' ];


/**
 * Set component const to export Dimensions UI.
 *
 * @since 0.2.3
 */
const Dimensions = () => {

	// Set state dependencies.
	const {
		selected,
	} = useSelect( ( select : Function ) => {
		return {
			selected: select( 'core/block-editor' ).getSelectedBlock(),
		}
	}, [] );

	// Render nothing if there is no block selected.
	if( ! selected ) {
		return null;
	}

	// Render component.
	return (
		<div className="qp-viewports-dimensions">
			<Position block={ selected } />
			<Margin block={ selected } />
			<Border block={ selected } />
			<Padding block={ selected } />
			<Content block={ selected } />
		</div>
	);
}

export default Dimensions;
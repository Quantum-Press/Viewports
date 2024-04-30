import { STORE_NAME } from '../../store/constants';
import Generator from '../../generator';
import Style from './style';
import { useResizeObserver } from '../../hooks/use-resize-observer';

const {
	data: {
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @param object props
 *
 * @since 0.2.2
 */
const StyleList = ({ block }) => {

	// Deconstruct block.
	const {
		clientId,
	} = block;

	// Set store dependencies.
	useSelect( ( select : Function ) => {
		return {
			valids: select( STORE_NAME ).getBlockValids( clientId ),
			viewport: select( STORE_NAME ).getViewport(),
		};
	}, [] );

	// Set resize state.
	const selector = 'iframe[name="editor-canvas"], .editor-styles-wrapper, .edit-site-editor-canvas-container'
	const size = useResizeObserver( {
		selector,
		box: 'border-box',
	} );

	// Set styles generator and get spectrumSet.
	const generator = new Generator( block, '#block-' + clientId.split( '-' ).shift() );
	const spectrumSet = generator.getSpectrumSet();

	// Render component
	return (
		<div className="qp-viewports-inspector-stylelist">
			{ spectrumSet.map( spectrum => {
				return (
					<Style
						spectrum={ spectrum }
						viewport={ size.width }
					/>
				);
			} ) }
		</div>
	);
}

export default StyleList;

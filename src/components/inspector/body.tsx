import Breadcrumb from './breadcrumb';
import BlockList from './blocklist';
import StyleList from './stylelist';
import Accordion from '../accordion';
import Dimensions from '../dimensions';

const {
	data: {
		useSelect,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @since 0.2.2
 */
const Body = () => {

	// Set state dependencies.
	const {
		selected,
	} = useSelect( ( select : Function ) => {
		return {
			selected: select( 'core/block-editor' ).getSelectedBlock(),
		}
	}, [] );

	// Render component.
	return (
		<div className="qp-viewports-inspector-body">
			<Breadcrumb />
			{ ! selected && ( <BlockList /> ) }
			{ selected && (
				<div className="qp-viewports-inspector-selected">
					<Accordion
						storePath="inspector.dimensions"
						defaultValue={ true }
						label={ __( 'Dimensions', 'quantum-viewports' ) }
					>
						<Dimensions />
					</Accordion>
					<Accordion
						storePath="inspector.styles"
						defaultValue={ true }
						label={ __( 'Styles', 'quantum-viewports' ) }
					>
						<StyleList
							block={ selected }
						/>
					</Accordion>
				</div>
			) }
		</div>
	);
}

export default Body;
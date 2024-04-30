import { getFilledStyles, getFormattedStyles } from './utils';

/**
 * Function to render padding interface.
 *
 * @since 0.2.3
 */
const Padding = ({ block }) => {

	// Deconstruct block.
	const {
		attributes: {
			style,
		}
	} = block;

	// Set schema.
	const schema = {
		top: '-',
		right: '-',
		bottom: '-',
		left: '-',
	}

	// Set padding.
	const padding = getFilledStyles( 'spacing.padding', style, schema );

	// Set formatted padding.
	const formatted = getFormattedStyles( padding );

	// Render component.
	return (
		<div className="qp-viewports-dimension padding" data-dimension="padding">
			<div className="view-label">{ 'padding' }</div>
			<div className="view-content">
				<div className="view-top">{ formatted.top }</div>
				<div className="view-right">{ formatted.right }</div>
				<div className="view-bottom">{ formatted.bottom }</div>
				<div className="view-left">{ formatted.left }</div>
			</div>
		</div>
	);
}

export default Padding;

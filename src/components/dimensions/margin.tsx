import { getFilledStyles, getFormattedStyles } from './utils';

/**
 * Function to render margin interface.
 *
 * @since 0.2.3
 */
const Margin = ({ block }) => {

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

	// Set margin.
	const margin = getFilledStyles( 'spacing.margin', style, schema );

	// Set formatted padding.
	const formatted = getFormattedStyles( margin );

	// Render component.
	return (
		<div className="qp-viewports-dimension margin" data-dimension="margin">
			<div className="view-label">{ 'margin' }</div>
			<div className="view-content">
				<div className="view-top">{ formatted.top }</div>
				<div className="view-right">{ formatted.right }</div>
				<div className="view-bottom">{ formatted.bottom }</div>
				<div className="view-left">{ formatted.left }</div>
			</div>
		</div>
	);
}

export default Margin;

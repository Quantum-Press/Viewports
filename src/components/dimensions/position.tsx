/**
 * Function to render position interface.
 */
const Position = block => {

	// Set schema.
	const schema = {
		top: '-',
		right: '-',
		bottom: '-',
		left: '-',
	}

	// Render component.
	return (
		<div className="qp-viewports-dimension position" data-dimension="position">
			<div className="view-label">{ 'position' }</div>
			<div className="view-content">
				<div className="view-top">{ schema.top }</div>
				<div className="view-right">{ schema.right }</div>
				<div className="view-bottom">{ schema.bottom }</div>
				<div className="view-left">{ schema.left }</div>
			</div>
		</div>
	);
}

export default Position;

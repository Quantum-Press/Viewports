/**
 * Function to render content interface.
 *
 * @since 0.2.3
 */
const Content = block => {

	// Render component.
	return (
		<div className="qp-viewports-dimension content" data-dimension="content">
			<div className="view-label">{ 'content' }</div>
			<div className="view-content">
				<div className="view-center">100% x auto</div>
			</div>
		</div>
	);
}

export default Content;

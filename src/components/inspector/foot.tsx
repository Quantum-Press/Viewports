import { STORE_NAME } from '@quantum-viewports/store';
import { getVersion } from '@quantum-viewports/utils';
import { logo } from '@quantum-viewports/components';

const {
	components: {
		Button,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 */
export const Foot = () => {

	// Setup version.
	const version = getVersion();

	// Render component.
	return (
		<div className="qp-viewports-inspector-foot">
			<Button
				className="qp-viewports-link"
				icon={ logo }
				href="https://quantum-press.com/en/"
				target="_blank"
				text={ __( 'by QuantumPress - Version', 'quantum-viewports' ) + ' ' + version }
			/>
		</div>
	);
}

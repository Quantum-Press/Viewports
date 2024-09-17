import { useOverflow, useLocalStorage } from '../../hooks';

import StyleList from './stylelist';
import Accordion from '../accordion';
import Dimensions from '../dimensions';

const {
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export selected ui.
 *
 * @since 0.2.4
 */
const Selected = ({ block }) => {

	// Set hook dependencies.
	const [ isOverflowing ] = useOverflow( '.qp-viewports-inspector-selected-wrap', 'height' );

	// Set states for Accordion visibility.
	const [ isOpenDimensions, setIsOpenDimensions ] = useLocalStorage( 'inspector.dimensions', true );
	const [ isOpenStyles, setIsOpenStyles ] = useLocalStorage( 'inspector.styles', false );

	// Set classNames.
	const classNames = [ 'qp-viewports-inspector-selected-wrap' ];
	if( isOverflowing ) {
		classNames.push( 'overflow' );
	}

	// Render component.
	return (
		<div className={ classNames.join( ' ' ) }>
			<div className="qp-viewports-inspector-selected">
				<Accordion
					isOpen={ isOpenDimensions }
					setIsOpen={ setIsOpenDimensions }
					label={ __( 'Dimensions', 'quantum-viewports' ) }
				>
					<Dimensions />
				</Accordion>
				<Accordion
					isOpen={ isOpenStyles }
					setIsOpen={ setIsOpenStyles }
					label={ __( 'Styles', 'quantum-viewports' ) }
				>
					<StyleList
						block={ block }
					/>
				</Accordion>
			</div>
		</div>
	);
}

export default Selected;
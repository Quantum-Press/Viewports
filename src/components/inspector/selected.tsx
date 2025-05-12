import { useOverflow, useLocalStorage } from '../../hooks';

import { BlockStyleList } from './stylelist';
import { BlockAttributeList } from './attributelist';
import Accordion from '../accordion';
import Dimensions from '../dimensions';

const {
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export selected ui.
 */
const Selected = ({ block }) => {

	// Set hook dependencies.
	const [ isOverflowing ] = useOverflow( '.qp-viewports-inspector-selected-wrap', 'height' );

	// Set states for Accordion visibility.
	const [ isOpenDimensions, setIsOpenDimensions ] = useLocalStorage( 'inspector.dimensions', true );
	const [ isOpenStyles, setIsOpenStyles ] = useLocalStorage( 'inspector.styles', false );
	const [ isOpenAttributes, setIsOpenAttributes ] = useLocalStorage( 'inspector.attributes', false );

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
					<BlockStyleList />
				</Accordion>
				<Accordion
					isOpen={ isOpenAttributes }
					setIsOpen={ setIsOpenAttributes }
					label={ __( 'Attributes', 'quantum-viewports' ) }
				>
					<BlockAttributeList />
				</Accordion>
			</div>
		</div>
	);
}

export default Selected;
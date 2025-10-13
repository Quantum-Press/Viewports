const {
	components: {
		Icon,
	}
} = window[ 'wp' ];

interface AccordionProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	label?: string;
	children?: React.ReactNode;
}

/**
 * Set function to return Accordion component.
 */
export const Accordion: React.FC<AccordionProps> = ({
	isOpen,
	setIsOpen,
	label = 'Toggle Accordion',
	children
}) => {

	// Set classNames.
	const classNames = [ 'qp-viewports-accordion' ];
	if( isOpen ) {
		classNames.push( 'active' );
	}

	/**
	 * Set function to fire on click accordion.
	 */
	const onClick = () => {
		setIsOpen( ! isOpen );
	};

	// Render component.
	return (
		<div className={ classNames.join( ' ' ) }>
			<a className="qp-viewports-accordion-toggle" onClick={ onClick }>
				{ ! isOpen && <Icon icon="arrow-right" /> }
				{ isOpen && <Icon icon="arrow-down" /> }
				{ label }
			</a>
			{ isOpen && <div className="qp-viewports-accordion-content">
				{ React.Children.map( children, ( child ) => { return ( child ) } ) }
			</div> }
		</div>
	);
};

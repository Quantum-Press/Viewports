import useLocalStorage from '../../hooks/use-local-storage';

const {
	components: {
		Icon,
	}
} = window[ 'wp' ];

interface AccordionProps {
	storePath?: string;
	defaultValue?: any;
	label?: string;
	children?: React.ReactNode;
}

/**
 * Set function to return Accordion component.
 *
 * @since 0.2.3
 */
const Accordion: React.FC<AccordionProps> = ({
	storePath,
	defaultValue = false,
	label = 'Toggle Accordion',
	children
}) => {

	// Set states.
	const [ isOpen, setIsOpen ] = useLocalStorage( storePath, defaultValue );

	// Set classNames.
	const classNames = [ 'qp-viewports-accordion' ];
	if( isOpen ) {
		classNames.push( 'active' );
	}

	/**
	 * Set function to fire on click accordion.
	 *
	 * @since 0.2.3
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

export default Accordion;

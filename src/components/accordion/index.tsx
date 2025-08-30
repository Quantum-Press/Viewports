const {
	components: { Icon }
} = window[ 'wp' ];

interface AccordionProps {
	isOpen: boolean;
	setIsOpen: ( value: boolean ) => void;
	label?: string;
	children?: React.ReactNode;
}

/**
 * React component: Accordion
 *
 * Provides an expandable/collapsible container to show or hide nested elements.
 * Useful for grouped controls, settings panels, or optional content sections.
 *
 * @param {boolean} isOpen - Indicates whether the accordion is expanded.
 * @param {(value: boolean) => void} setIsOpen - Callback to toggle the open state.
 * @param {string} [label='Toggle Accordion'] - Accessible label for the toggle control.
 * @param {React.ReactNode} [children] - Content displayed when the accordion is open.
 *
 * @returns {JSX.Element} Accordion element with toggle and optional content region.
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Accordion
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 *   label="Show advanced options"
 * >
 *   <AdvancedSettings />
 * </Accordion>
 */
export const Accordion: React.FC<AccordionProps> = ({
	isOpen,
	setIsOpen,
	label = 'Toggle Accordion',
	children
}) => {
	const onClick = () => setIsOpen( ! isOpen );

	const classNames = [ 'qp-viewports-accordion' ];
	if ( isOpen ) classNames.push( 'active' );

	return (
		<div className={ classNames.join( ' ' ) }>
			<a className="qp-viewports-accordion-toggle" onClick={ onClick }>
				<Icon icon={ isOpen ? 'arrow-down' : 'arrow-right' } />
				{ label }
			</a>
			{ isOpen && (
				<div className="qp-viewports-accordion-content">
					{ React.Children.map( children, ( child ) => child ) }
				</div>
			) }
		</div>
	);
};

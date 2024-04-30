import { STORE_NAME } from '../../store/constants';

const {
	components: {
		Button,
	},
	data: {
		select,
		dispatch,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];

/**
 * Set component const to export sidebar control-edit ui.
 *
 * @param object props
 *
 * @since 0.2.2
 */
const Block = ( props ) => {

	// Deconstruct properties.
	const {
		block,
		level,
	} = props;

	// Deconstruct block.
	const {
		clientId,
		name,
		innerBlocks
	} = block;

	// Set store.
	const store = select( STORE_NAME );

	// Set indicators.
	const hasDefaults = store.hasBlockDefaults( clientId );
	const hasSaves = store.hasBlockSaves( clientId );
	const hasChanges = store.hasBlockChanges( clientId );
	const hasRemoves = store.hasBlockRemoves( clientId );

	// Set buttonText.
	const buttonText = hasChanges || hasRemoves || hasSaves ? 'VCSS' : hasDefaults ? 'CSS' : '';

	// Set className.
	const className = `qp-viewports-inspector-blocklist-block level-${ level }`;

	// Set button classNames.
	const buttonClassNames = [ 'select' ];
	if( ! hasChanges && ! hasRemoves && ! hasSaves && ! hasDefaults ) {
		buttonClassNames.push( 'disabled' );
	}


	/**
	 * Set function to return child blocks.
	 *
	 * @since 0.2.2
	 */
	const getChildBlocks = () => {

		// Check if we have innerBlocks..
		if( innerBlocks && 0 < innerBlocks.length ) {
			return innerBlocks;
		}

		// Check if innerBlocks controlled seperately.
		const innerBlocksControlled = select( 'core/block-editor' ).areInnerBlocksControlled( clientId );
		if( ! innerBlocksControlled ) {
			return [];
		}

		// Check if innerBlocks are seperately stored in blockEditor store.
		const clientIds = select( 'core/block-editor' ).getBlockOrder( clientId );
		if( 0 === clientIds.length ) {
			return [];
		}

		// Iterate over clientIds to collect its block object.
		const blocks = [];
		for( let index = 0; index < clientIds.length; index++ ) {
			const clientId = clientIds[ index ];
			const block = select( 'core/block-editor' ).getBlock( clientId );

			blocks.push( block );
		}

		return blocks;
	}


	/**
	 * Set function to fire on click select.
	 *
	 * @since 0.2.2
	 */
	const onClickSelect = () => {
		dispatch( 'core/block-editor' ).selectBlock( clientId );
	}

	// Set childBlocks
	const childBlocks = getChildBlocks();

	// Render component.
	return (
		<>
			<div className={ className }>
				<div className="name">{ name }</div>
				<div className="actions">
					<Button
						className={ buttonClassNames.join( ' ' ) }
						text={ buttonText }
						label={ __( 'Select block', 'quantum-viewports' ) }
						onClick={ onClickSelect }
					/>
				</div>
			</div>
			{ 0 < childBlocks.length && childBlocks.map( block => {
				return (
					<Block block={ block } level={ level + 1 } />
				)
			} ) }
		</>
	)
}

export default Block;
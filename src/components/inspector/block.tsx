import { STORE_NAME } from '../../store/constants';
import { svgs } from '../svgs';

const {
	components: {
		Icon,
		Button,
	},
	data: {
		select,
		dispatch,
		useSelect,
	},
	element: {
		useEffect,
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

	const {
		clientId,
		name,
		innerBlocks
	} = block;

	// Set className.
	const className = `qp-viewports-inspector-blocklist-block level-${ level }`;

	const store = select( STORE_NAME );

	const hasDefaults = store.hasBlockDefaults( clientId );
	const hasSaves = store.hasBlockSaves( clientId );
	const hasChanges = store.hasBlockChanges( clientId );
	const hasRemoves = store.hasBlockRemoves( clientId );

	const buttonText = hasChanges || hasRemoves || hasSaves ? 'VCSS' : 'CSS';

	const buttonClassNames = [ 'select' ];
	if( ! hasChanges && ! hasRemoves && ! hasSaves && ! hasDefaults ) {
		buttonClassNames.push( 'disabled' );
	}

	/**
	 * Set function to fire on click select.
	 *
	 * @since 0.2.2
	 */
	const onClickSelect = () => {
		dispatch( 'core/block-editor' ).selectBlock( clientId );
	}

	/**
	 * Set function to fire on click reset.
	 *
	 * @since 0.2.2
	 */
	const onClickReset = () => {

	}

	console.log( 'are inner blocks controlled ', select( 'core/block-editor' ).areInnerBlocksControlled( clientId ) );

	return (
		<>
			<div className={ className }>
				<div className="name">{ name }</div>
				<div className="actions">
					{ ( hasChanges || hasRemoves ) &&
						<Button
							className="reset"
							icon="update"
							label={ __( 'Reset changes', 'quantum-viewports' ) }
							onClick={ onClickReset }
						/>
					}

					<Button
						className={ buttonClassNames.join( ' ' ) }
						text={ buttonText }
						label={ __( 'Select block', 'quantum-viewports' ) }
						onClick={ onClickSelect }
					/>
				</div>
			</div>
			{ 0 < innerBlocks.length && innerBlocks.map( block => {
				return (
					<Block block={ block } level={ level + 1 } />
				)
			} ) }
		</>
	)
}

export default Block;
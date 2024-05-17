import type { Attributes } from '../utils';
import { STORE_NAME } from '../store/constants';

const {
	data: {
		select,
		dispatch,
	},
} = window[ 'wp' ];


/**
 * Set function to render blockSave wrapped in a higher order component.
 *
 * @since 0.1.0
 */
export const BlockSave = ( { block, props }: { block: Attributes, props: Attributes } ) => {
	const clientId = props.attributes.tempId;
	const store = select( STORE_NAME );

	// At first we block core/group and the first save render to compare differences.
	if ( ! clientId ) {
		return block.save( props );
	}

	// Set save state to differ between autosave and save process.
	const isSaving = store.isSaving();
	const isAutoSaving = store.isAutoSaving();

	// Check whether we need to save block viewports.
	const hasBlockViewports = store.hasBlockViewports( clientId );

	// Check whether we need to save block viewports.
	if ( store.isRegistered( clientId ) && hasBlockViewports && isSaving ) {
		const saves = store.getGeneratedBlockSaves( clientId );
		const inlineStyle = store.getInlineStyle( clientId );

		// Avoid the trap of using { ...props.attributes, ...defaults }.
		// It will destroy the connection to html comment serializer.
		// We will reinject data after save end.
		props.attributes.style = saves.hasOwnProperty( 0 ) ? saves[ 0 ].style : {};
		props.attributes.viewports = Object.fromEntries(
			Object.entries( saves ).filter( ( [ key ] ) => key !== '0' )
		);

		if ( Object.keys( inlineStyle ).length ) {
			props.attributes.inlineStyles = inlineStyle;
		} else {
			props.attributes.inlineStyles = {};
		}

		console.log( '%cQP-Viewports -> SAVE_BLOCK WITH VIEWPORTS', 'padding:4px 8px;background:green;color:white', clientId, props.attributes.style, props.attributes.viewports, props.attributes.inlineStyles );

		dispatch( STORE_NAME ).saveBlock( clientId );
	}

	// Check whether we need to save block custom renderer without viewports.
	if ( store.isRegistered( clientId ) && ! hasBlockViewports && isSaving ) {
		const defaults = store.getBlockDefaults( clientId );
		const style = defaults.hasOwnProperty( 'style' ) ? defaults.style : {};
		const inlineStyle = store.getInlineStyle( clientId );

		props.attributes.style = style;

		if ( Object.keys( inlineStyle ).length ) {
			props.attributes.inlineStyles = inlineStyle;
		} else {
			props.attributes.inlineStyles = {};
		}

		// console.log( '%cQP-Viewports -> SAVE_BLOCK WITHOUT VIEWPORTS	', 'padding:4px 8px;background:green;color:white', clientId, props.attributes );
	}

	// Check whether we need to autosave block viewports.
	if ( hasBlockViewports && isAutoSaving ) {
		const defaults = store.getBlockDefaults( clientId );
		const style = defaults.hasOwnProperty( 'style' ) ? defaults.style : {};

		props.attributes.style = style;

		console.log( '%cQP-Viewports -> AUTOSAVE_BLOCK', 'padding:4px 8px;background:green;color:white', clientId, props.attributes.style, props.attributes.viewports, props.attributes.style, props.attributes.inlineStyle );

		return block.save( props );
	}

	return block.save( props );
}

export default BlockSave;

import type { Attributes } from '../utils';
import { STORE_NAME } from '../store/constants';
import { debug } from '../utils';

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

		// Hier ein mtime in JS einbauen.
		const saves = store.getGeneratedBlockSaves( clientId );
		const inlineStyle = store.getInlineStyle( clientId );

		props.attributes.viewports = saves;
		// Hier ein mtime in JS einbauen. - End.

		if ( Object.keys( inlineStyle ).length ) {
			props.attributes.inlineStyles = inlineStyle;
		} else {
			props.attributes.inlineStyles = {};
		}

		debug(
			'log',
			'save',
			'block with viewports',
			{
				clientId,
				viewports: props.attributes.viewports,
				inlineStyles: props.attributes.inlineStyles,
			}
		);

		dispatch( STORE_NAME ).saveBlock( clientId );

		return block.save( props );
	}

	// Check whether we need to save block custom renderer without viewports.
	if ( store.isRegistered( clientId ) && ! hasBlockViewports && isSaving ) {
		const inlineStyle = store.getInlineStyle( clientId );

		props.attributes.viewports = {};

		if ( Object.keys( inlineStyle ).length ) {
			props.attributes.inlineStyles = inlineStyle;
		} else {
			props.attributes.inlineStyles = {};
		}

		debug(
			'log',
			'save',
			'block without viewports',
			{
				clientId,
				attributes: props.attributes
			}
		);

		return block.save( props );
	}

	// Check whether we need to autosave block viewports.
	if ( store.isRegistered( clientId ) && hasBlockViewports && isAutoSaving ) {
		const saves = store.getGeneratedBlockSaves( clientId );
		const inlineStyle = store.getInlineStyle( clientId );

		props.attributes.viewports = saves;

		if ( Object.keys( inlineStyle ).length ) {
			props.attributes.inlineStyles = inlineStyle;
		} else {
			props.attributes.inlineStyles = {};
		}

		debug(
			'log',
			'autosave',
			'block with viewports',
			{
				clientId,
				viewports: props.attributes.viewports,
				inlineStyles: props.attributes.inlineStyles,
			}
		);

		return block.save( props );
	}

	return block.save( props );
}

export default BlockSave;

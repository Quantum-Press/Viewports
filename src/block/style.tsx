import { compileMediaQueries } from '../utils/styles';
import { STORE_NAME } from '../store/constants';

const {
	data: {
		select,
		useSelect,
	},
} = window[ 'wp' ];

/**
 * Set function to render blockStyle depending on outer state.
 *
 * @param
 *
 * @since 0.1.0
 */
export default function BlockStyle( args : any ) {
	const { props } = args;
	const {
		clientId,
		attributes
	} = props;
	const { tempId } = attributes;

	// Set store id to jump over first init.
	const storeId = tempId !== clientId ? clientId : tempId;

	// Set states.
	const {
		valids,
	} = useSelect( ( select : Function ) => {
		const store = select( STORE_NAME );

		return {
			valids: store.getBlockValids( storeId ),
		};
	}, [] );

	// Build css.
	let css = compileMediaQueries( storeId, valids );
		css = css.split( ';' ).join( '!important;' );

	if ( '' === css ) {
		return null;
	}

	return <style id={ 'qp-viewports-block-style-' + storeId }>{ css }</style>;
}
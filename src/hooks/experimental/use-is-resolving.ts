/**
 * Set function to indicate if context has resolver properties.
 *
 * @since 0.1.0
 */
const isResolverBlock = ( block, props ) => {
	const blockNames = [
		'core/page-list',
		'core/page-list-item',
		'core/navigation-link',
		'core/navigation-submenu',
		'core/post-template',
	];

	if( -1 < blockNames.indexOf( block.name ) ) {
		return true;
	}

	// return false;

	return hasResolverContext( props.context );
}


/**
 * Set function to indicate if context has resolver properties.
 *
 * @since 0.1.0
 */
const hasResolverContext = ( context ) => {
	const properties = [ 'query', 'postType' ];

	let hasResolverContext = false;

	for( let index = 0; index < properties.length; index++ ) {
		const property = properties[ index ];

		if( context.hasOwnProperty( property ) ) {
			hasResolverContext = true;
			break;
		}
	}

	return hasResolverContext;
}
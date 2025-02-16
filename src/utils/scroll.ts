/**
 * Set function to indicate whether element is scrollable.
 */
export function isScrollable( element : HTMLElement ) : boolean {
	const computed = getComputedStyle( element );

	return ( 'auto' === computed.overflowY || 'scroll' === computed.overflowY ) && element.scrollHeight > element.clientHeight;
}


/**
 * Set function to scroll to scrollable parent element.
 */
export function scrollParent( element : HTMLElement ) {
	let parent = element.parentElement;

	while( parent ) {
		if( isScrollable( parent ) ) {

			// Set timeout to scroll in parent if not rendered yet.
			setTimeout( () => {
				parent.scrollTo( {
					top: element.offsetTop,
					behavior: 'smooth',
				} );
			}, 300 );

			break;
		}

		parent = parent.parentElement;
	}
}
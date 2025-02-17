const { isNull, isArray } = window[ 'lodash' ];

// Types for Debug Message Types and Sections.
type DebugType = 'log' | 'dir' | 'error';
type DebugSection = string;
type DebugTitle = string;

// Debugging Options Interface
interface DebugOptions {
	enabled : boolean;
	sections : DebugSection[] | true; // List of sections for which debugging is allowed
}


/**
 * Set function to check if debugging is enabled via URL parameter.
 *
 * @return {boolean} whether debug is enabled
 */
function isDebugEnabled() : boolean {
	const params = new URLSearchParams( window.location.search );
	const sectionsParam = params.get( 'debug' );

	// If param not set, we dont want to debug.
	if( isNull( sectionsParam ) ) {
		return false;
	}

	return true;
}


/**
 * Set function to check which sections have debugging enabled
 *
 * @return {DebugSection[] | true} list of sections to debug or all
 */
function getDebugSections() : DebugSection[] | true {
	const params = new URLSearchParams( window.location.search );
	const sectionsParam = params.get( 'debug' );

	// If param not set, we set empty array.
	if( isNull( sectionsParam ) ) {
		return [];
	}

	// If param set, we debug everything.
	if( '' === sectionsParam ) {
		return true;
	}

	// If param is filled, we split debug sections to debug.
	if( sectionsParam ) {
		return sectionsParam.split( ',' ) as DebugSection[];
	}

	return [];
}

// Set global debugging options.
export const debugOptions: DebugOptions = {
	enabled: isDebugEnabled(),
	sections: getDebugSections(),
};

/**
 * Set function to debug by section.
 * This will only fire, if there are implications to debug in GET Params.
 *
 * @param {DebugType} type
 * @param {DebugSection} section
 * @param {DebugTitle} title
 * @param {any} message
 *
 * @return {void}
 */
export const debug = ( type: DebugType, section: DebugSection, title: DebugTitle, message: any = '' ) : void => {

	// Do nothing if debugging is not enabled.
	if( ! debugOptions.enabled ) {
		return;
	}

	// Do nothing if the section is not in the allowed sections and is not "general".
	if( isArray( debugOptions.sections ) ) {
		if( ! debugOptions.sections.includes( section ) && section !== 'general' ) {
			return;
		}
	}

	// Format message.
	const formattedSection = `Viewports [${ section.toUpperCase() }] - ${ title }`;

	// Call console method by type.
	switch ( type ) {
		case 'log':
			console.log( `%c${ formattedSection }`, 'padding:4px 8px;background:darkgreen;color:white', message );
			break;
		case 'dir':
			console.log( `%c${ formattedSection }`, 'padding:4px 8px;background:darkgreen;color:white' );
			console.dir( message );
			break;
		case 'error':
			console.error( `%c${ formattedSection }`, message );
			break;
		default:
			console.log( `%c${ formattedSection }`, 'padding:4px 8px;background:darkgreen;color:white', message );
	}
}

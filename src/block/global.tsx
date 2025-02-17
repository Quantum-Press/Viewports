import useGlobalBlockStyles from '../hooks/use-global-block-styles';
import { STORE_NAME } from '../store';
import {
	findObjectChanges,
	traverseExist,
} from '../utils';

const {
	data: {
		useSelect,
	},
	element: {
		useEffect,
		useState,
	}
} = window[ 'wp' ];

const {
	isEmpty,
} = window[ 'lodash' ];

const supports = [
	'spacing',
	'border',
	'shadow',
]

const mapping = {
	spacing: '.components-tools-panel[class*="css-"]:nth-child(2)',
}


/**
 * Set component const to export ui wrap.
 */
export default function GlobalBlockStyles() {
	const [ globalBlockStyles, setGlobalBlockStyles ] = useGlobalBlockStyles();


	const [ prevGlobalBlockStyles, setPrevGlobalBlockStyles ] = useState( globalBlockStyles );
	const [ ignoreChanges, setIgnoreChanges ] = useState( false );

	const {
		isEditing,
		iframeViewport,
	} = useSelect( select => {
		const store = select( STORE_NAME );

		return {
			isActive: store.isActive(),
			isEditing: store.isEditing(),
			viewport: store.getViewport(),
			iframeViewport: store.getIframeViewport(),
		}
	} );


	// Set useEffect to handle changes in blockStyles.
	useEffect( () => {
		if( ignoreChanges ) {
			return;
		}

		const changes = findObjectChanges( globalBlockStyles, prevGlobalBlockStyles );

		if( ! isEmpty( changes ) ) {
			Object.entries( changes ).forEach( ( [ blockName, settings ] ) => {
				updateGlobalBlock( blockName, settings );
			} );

			setPrevGlobalBlockStyles( globalBlockStyles );
		} else {
			// Hier könnte vielleicht der Switch für den aktuellen Viewport rein mit anschließendem ignore.
		}

	}, [ globalBlockStyles ] );


	// Set function to check if the block has viewports.
	const hasViewports = ( block ) => {
		return block.hasOwnProperty( 'custom' ) && block.custom.hasOwnProperty( 'viewports' );
	}


	// Set function to check if the block has a specific viewport.
	const hasViewport = ( block, viewport ) => {
		return hasViewports( block ) && block.custom.viewports.hasOwnProperty( viewport );
	}


	// Set function to check if the block has viewports.
	const findHighestValidViewport = ( settingsKey : string, settings ) : number => {

		// Reverse Iteration to get the latest from iframeViewport on.
		const viewports = Object.keys( settings ).reverse();

		// Iterate over changes to check property to remove.
		for( const dirtyViewport of viewports ) {
			let viewport = parseInt( dirtyViewport );

			if( viewport > iframeViewport ) {
				continue;
			}

			if( traverseExist( [ viewport, settingsKey ], settings ) ) {
				return viewport;
			}
		}

		return 0;
	}


	// Set function to update a single global block.
	const updateGlobalBlock = ( blockName, settings ) => {
		const prevSettings = prevGlobalBlockStyles[ blockName ];
		let nextSettings = { ... prevSettings };

		Object.entries( settings ).forEach( ( [ settingsKey, settingsValue ] ) => {
			if( -1 !== supports.indexOf( settingsKey ) ) {
				nextSettings = assignGlobalBlockSetting( nextSettings, settingsKey, settingsValue );
			}
		} );

		// Hier muss der block aktualisiert werden.
		console.log( 'nextSettings', nextSettings );
	}


	const assignGlobalBlockSetting = ( nextSettings, settingsKey, settingsValue ) => {
		if( isEditing ) {
			if( hasViewport( nextSettings, iframeViewport ) ) {
				nextSettings.custom.viewports = {
					... nextSettings.custom.viewports,
					[ iframeViewport ]: {
						... nextSettings.custom.viewports[ iframeViewport ],
						[ settingsKey ]: settingsValue,
					}
				}

				return nextSettings;
			}

			if( hasViewports( nextSettings ) ) {
				nextSettings.custom.viewports = {
					... nextSettings.custom.viewports,
					[ iframeViewport ]: {
						[ settingsKey ]: settingsValue,
					}
				}

				return nextSettings;
			}

			if( ! nextSettings.hasOwnProperty( 'custom' ) ) {
				nextSettings.custom = {
					viewports: {
						[ iframeViewport ]: {
							[ settingsKey ]: settingsValue,
						}
					}
				}

				return nextSettings;
			}

			return nextSettings

		} else {
			const highestViewport = findHighestValidViewport( settingsKey, nextSettings );

			if( highestViewport === 0 ) {
				nextSettings[ settingsKey ] = settingsValue;
			} else {
				nextSettings.custom.viewports = {
					... nextSettings.custom.viewports,
					[ highestViewport ]: {
						... nextSettings.custom.viewports[ highestViewport ],
						[ settingsKey ]: settingsValue,
					}
				}
			}
		}

		return nextSettings;
	}

	return null;
}
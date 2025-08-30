import { isInTabletRange, isInDesktopRange, getInRange } from '../../store';

const {
	components: {
		Icon,
	},
	element: {
		useMemo,
		memo,
	},
	i18n: {
		__,
	}
} = window[ 'wp' ];


/**
 * Renders Pointer UI for different viewports.
 *
 * @param {ViewportType} viewportType - The current viewport type
 * @param {boolean} isEditing - Indicates if viewports is in editing mode
 * @param {number} iframeViewport - The iframe viewport size
 * @param {boolean} hasTabletSpectrum - Indicates if tablet has spectrums
 * @param {boolean} hasDesktopSpectrum - Indicates if desktop has spectrums
 *
 * @returns {JSX.Element | null}
 */
export const Pointer = memo( ( { deviceType, isEditing, iframeViewport, hasTabletSpectrum, hasDesktopSpectrum } ) => {
	const inRange = getInRange( deviceType );

	// Memoize icon rendering logic based on the relevant conditions
	const shouldRenderIcons = useMemo( () => {

		// Editing state and viewport check
		if( isEditing ) {
			if( inRange( iframeViewport ) ) {
				return {
					showIcons: true,
					editing: true,
				};
			} else {
				return {
					showIcons: false,
					editing: true,
				};
			}
		}

		// Mobile viewport logic
		if( deviceType === 'Mobile' ) {
			if(
				inRange( iframeViewport ) ||
				( isInTabletRange( iframeViewport ) && ! hasTabletSpectrum ) ||
				( isInDesktopRange( iframeViewport ) && ! hasTabletSpectrum && ! hasDesktopSpectrum )
			) {
				return { showIcons: true, editing: false };
			}
		}

		// Tablet viewport logic
		if( deviceType === 'Tablet' ) {
			if(
				( hasTabletSpectrum && inRange( iframeViewport ) ) ||
				( hasTabletSpectrum && ! hasDesktopSpectrum && isInDesktopRange( iframeViewport ) )
			) {
				return { showIcons: true, editing: false };
			}
		}

		// Desktop viewport logic
		if( deviceType === 'Desktop' && hasDesktopSpectrum && inRange( iframeViewport ) ) {
			return { showIcons: true, editing: false };
		}

		return { showIcons: false }; // No icons to render if none of the conditions are met

	}, [ deviceType, isEditing, iframeViewport, hasTabletSpectrum, hasDesktopSpectrum ] );

	// Return null if no icons should be rendered
	if( ! shouldRenderIcons.showIcons ) {
		return null;
	}

	// Render the icons based on the editing state
	return (
		<>
			<Icon
				icon="arrow-down"
				className={ shouldRenderIcons.editing ? 'is-editing' : '' }
			/>
		</>
	);
} );

export default Pointer;

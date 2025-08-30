// Import preparement dependencies.
import * as data from '@wordpress/data';
import * as element from '@wordpress/element';
import * as styleEngine from '@wordpress/style-engine';

// Extend global window object.
global.window[ 'wp' ] = {
	data,
	element,
	styleEngine
};

// Import test environment.
import { describe, expect, test } from '@jest/globals';

// Import store parts.
import {
	collapseViewportSet,
} from '..';


test( "can collapseViewportSet() merge multiple viewports and handle removal of properties", () => {
	const viewportSet = {
		0: {
			767: { style: { qpFlex: { active: true, direction: "row", alignment: "start" }, margin: "10px" } }
		},
		320: {
			0: { style: {} },
			1023: { style: { color: "#fff" } }
		},
		768: {
			0: { style: { qpFlex: { active: false } } }
		},
		1024: {
			0: { style: { qpFlex: { active: true, direction: "row-reverse" }, margin: "20px" } }
		}
	};

	expect( collapseViewportSet( viewportSet, 0 ) ).toStrictEqual( {
		qpFlex: { active: true, direction: "row", alignment: "start" },
		margin: "10px",
	} );

	expect( collapseViewportSet( viewportSet, 320 ) ).toStrictEqual( {
		qpFlex: { active: true, direction: "row", alignment: "start" },
		margin: "10px",
		color: "#fff"
	} );

	expect( collapseViewportSet( viewportSet, 768 ) ).toStrictEqual( {
		qpFlex: { active: false },
			color: "#fff"
	} );

	expect( collapseViewportSet( viewportSet, 1024 ) ).toStrictEqual( {
		qpFlex: { active: true, direction: "row-reverse" },
		margin: "20px",
	} );
} );
// Import preparement dependencies.
import deepFreeze from 'deep-freeze';
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
import { DEFAULT_STATE } from '../..';
import {
	State,
	Action
} from '../../../types';

import { removeBlock } from '../removeBlock';


test( 'can removeBlock() without existing clientId', () => {
	const state = deepFreeze( {
		... DEFAULT_STATE,
		saves: {},
		changes: {},
		valids: {}
	} ) as State;

	const action = {
		type: 'REMOVE_BLOCK',
		clientId: 'client-id',
	} as Action;

	const check = {
		... DEFAULT_STATE,
		saves: {},
		changes: {},
		valids: {},
	} as State;

	const result = removeBlock( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toStrictEqual( check );
} );


test( 'can removeBlock() with existing clientId', () => {
	const state = deepFreeze( {
		... DEFAULT_STATE,
		saves: {
			'client-id': {},
		},
		changes: {
			'client-id': {},
		},
		valids: {
			'client-id': {},
		}
	} ) as State;

	const action = {
		type: 'REMOVE_BLOCK',
		clientId: 'client-id',
	} as Action;

	const check = {
		... DEFAULT_STATE,
		saves: {},
		changes: {},
		valids: {},
	} as State;

	const result = removeBlock( state, action );

	// Ignore css, inlineStyle and spectrum sets to debug in generator.test.ts
	result.cssSet = check.cssSet;
	result.inlineStyleSets = check.inlineStyleSets;
	result.spectrumSets = check.spectrumSets;

	expect( result ).toStrictEqual( check );
} );

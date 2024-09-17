import {
	isObject,
	getMergedAttributes,
	sanitizeAttributes,
	fillEmpty,
	traverseExist,
	traverseFilled,
	traverseGet,
} from "./attributes";
import type { Attributes } from "./attributes";
import { debug } from "./debug";
import {
	isSiteEditor,
	getVersion,
	openSidebar,
	openSettingsTab,
	openStylesTab,
} from "./editor";
import { useLongPress } from './longpress';
import { isScrollable, scrollParent } from "./scroll";

export {
	isObject,
	getMergedAttributes,
	sanitizeAttributes,
	fillEmpty,
	traverseExist,
	traverseFilled,
	traverseGet,
	debug,
	isSiteEditor,
	getVersion,
	openSidebar,
	openSettingsTab,
	openStylesTab,
	useLongPress,
	isScrollable,
	scrollParent,
}

export type {
	Attributes,
}
import { isObject, getMergedAttributes, sanitizeAttributes, fillEmpty } from "./attributes";
import type { Attributes } from "./attributes";
import { isSiteEditor, getVersion } from "./editor";
import { useLongPress } from './longpress';
import { isScrollable, scrollParent } from "./scroll";

export {
	isObject,
	getMergedAttributes,
	sanitizeAttributes,
	fillEmpty,
	isSiteEditor,
	getVersion,
	useLongPress,
	isScrollable,
	scrollParent,
}

export type {
	Attributes,
}
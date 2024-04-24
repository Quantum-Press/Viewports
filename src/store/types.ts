import type { Attributes } from '../utils/types';

export type Viewports = {
	[key : number] : string,
}

export type Styles = {
	[key : string] : [ string | number | object | Styles ],
}

export type Renderer = {
	[ key : number ] : Function,
}

export type RendererList = {
	[ key : string ] : Renderer,
}

export type State = {
	viewports : Viewports;
	viewport : number;
	isRegistering : boolean;
	isReady : boolean;
	isActive : boolean;
	isInspecting: boolean;
	inspectorPosition : string;
	isEditing : boolean;
	isSaving : boolean;
	isAutoSaving : boolean;
	isLoading : boolean;
	desktop : number;
	tablet : number;
	mobile : number;
	init : {
		[key : string] : boolean,
	};
	defaults : {
		[key : string] : Styles;
	};
	saves : {
		[key : string] : {
			[key : number] : Styles;
		};
	};
	changes : {
		[key : string] : {
			[key : number] : Styles;
		};
	};
	removes : {
		[key : string] : {
			[key : number] : Styles;
		};
	};
	valids : {
		[key : string] : {
			[key : number] : Styles;
		};
	};
	inspect : object | boolean;
	lastEdit : number;
	renderer : Renderer,
}

export type Action = {
	type         : string,
	block?       : object | boolean,
	clientId?    : string,
	viewports?   : Viewports,
	viewport?    : number,
	attributes?  : Attributes,
	props?       : Attributes,
	prop?        : string,
	callback?    : Function,
	force?       : boolean,
	priority?    : number,
	position?    : string,
};

export type Reducers = {
	[key : string] : Function;
}
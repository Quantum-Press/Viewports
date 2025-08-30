import type { Size } from '../hooks';
import type {
	clientId,
	BlockStyles,
	BlockAttributes,
	Spectrum,
	CSSViewportSets,
	SpectrumSets,
	ObjectOccurence,
} from './';

export type ViewportsConfig = {
	distribution: string;
	version: string;
}

export type viewportType = 'desktop' | 'tablet' | 'mobile' | '';
export type viewport = number|string;
export type Viewports = {
	[ key: viewport ] : string,
}
export type ViewportAny = {
	[ key: viewport ] : any,
}


export type ViewportSets = {
	[ key: clientId ] : ViewportSet,
}
export type ViewportSet = {
	[ key: viewport ] : ViewportStyleSets;
}
export type ViewportSetIterators = {
	viewports: viewport[],
	maxWidths: viewport[],
}
export type DeprecatedViewportSet = {
	[ key: viewport ] : ViewportStyleSet;
}
export type ViewportStyleSets = {
	[ key: number ] : ViewportStyleSet;
}
export type ViewportStyleSet = {
	style?: BlockStyles,
}

export type BlockDifferences = {
	changes: ViewportStyleSet,
	removes: ViewportStyleSet,
}
export type ViewportSetOccurence = {
	[ key: viewport ] : {
		[ key: number ] : {
			path: Array<string | number>,
			value: any,
			merged: any,
		},
	}
}

export type RendererPropertySet = {
	[ key: string ] : RendererSet,
}

export type RendererSet = {
	[ key: number ] : {
		type?: string,
		callback: Function,
		selectors: SelectorSet,
		mapping?: RendererMapping,
	},
}

export type RendererMapping = {
	[ key: string ] : string,
}

export type InlineStyleSets = {
	[ key : string ]: InlineStyleSet,
}

export type InlineStyleSet = {
	[ key : number ]: {
		[ key : string ] : Array<InlineStyle>,
	}
}

export type InlineStyle = {
	priority: number,
	css: string,
	from: number,
	to: number,
}

export type SelectorSet = {
	[ key : string ]: string,
}

export type IndicatorSelectorSet = {
	[ key : string ] : {
		property: string,
		spectrumSet: Array<Spectrum>,
	}
}

export type Reducers = {
	[ key : string ] : Function,
}

export type ReducerManager = {
	reducer: Function,
	addReducer: Function,
}

export type State = {
	viewports: Viewports,
	viewport: number,
	iframeSize: Size,
	iframeViewport: number,
	isRegistering: boolean,
	isReady: boolean,
	isActive: boolean,
	isInspecting: boolean,
	inspectorPosition: string,
	isEditing: boolean,
	isSaving: boolean,
	isAutoSaving: boolean,
	isLoading: boolean,
	desktop: number,
	tablet: number,
	mobile: number,
	saves: ViewportSets,
	changes: ViewportSets,
	removes: ViewportSets,
	valids: ViewportSets,
	inspect: object | boolean,
	lastEdit: number,
	renderer: RendererPropertySet,
	cssSet: CSSViewportSets,
	spectrumSets: SpectrumSets,
	inlineStyleSets: InlineStyleSets,
}

export type Action = {
	type: string,
	block?: object | boolean,
	blockName?: string,
	clientId?: string,
	viewports?: Viewports,
	viewport?: number,
	viewportType?: viewportType,
	size?: Size,
	attributes?: BlockAttributes,
	props?: Array<string>,
	prop?: string,
	callback?: Function,
	force?: boolean,
	priority?: number,
	selectors?: SelectorSet,
	mapping?: RendererMapping,
	position?: string,
}

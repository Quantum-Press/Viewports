import type { Attributes } from '../utils';
import type { Size } from '../hooks';

export type BlockList = Block[];

export type Block = any;

export type ViewportsConfig = {
	distribution: string;
	version: string;
}

export type Styles = {
	[ key: string ] : any,
}

export type ViewportType = 'desktop' | 'tablet' | 'mobile' | '';

export type Viewports = {
	[ key: number ] : string,
}

export type clientViewportSets = {
	[ key: string ] : ViewportStyle,
}

export type ViewportStyle = { // Das müsste dann nur noch das object repräsentieren. ViewportStyleSet?
	[ key: number ] : {
		style: Styles,
		viewports?: any,
		to?: number
	}
}

export type ViewportStyleSet = { // Dopplung mit ViewportStyle. Warum? Wenn clientViewportSets dann müsste das hier bleiben. ViewportStyleSets?
	[ key: number ] : {
		style: Styles,
		to?: number,
	};
}

export type BlockDifferences = {
	changes: ViewportStyleSet,
	removes: ViewportStyleSet,
}

export type InitSet = {
	[ key: string ] : boolean,
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

export type CSSCollectionSet = Array<CSSCollection>

export type CSSCollection = {
	selector: string,
	declarations: string,
};

export type CSSProperties = {
	[ key : string ]: string,
};

export type CSSViewportSets = {
	[ key : string ]: CSSViewportSet,
}

export type CSSViewportSet = {
	[ key : number ]: Array<CSSViewport>,
};

export type CSSViewport = {
	[ key : number ]: string,
}

export type RuleSet = Array<Rule>;

export interface Rule {
	type: string,
	blockName: string,
	property: string,
	viewport: number,
	priority: number,
	selector: string,
	selectors: SelectorSet,
	declarations: string,
	css: string,
	style: Styles,
	properties: CSSProperties,
	saves: Attributes,
	savesProperties: CSSProperties,
	hasSaves: boolean,
	changes: Attributes,
	changesProperties: CSSProperties,
	hasChanges: boolean,
	removes: Attributes,
	removesProperties: CSSProperties,
	hasRemoves: boolean,
}

export type SpectrumSets = {
	[ key : string ] : SpectrumSet,
};

export type SpectrumSet = Array<Spectrum>;

export interface Spectrum extends Rule {
	from: number,
	to: number,
	media: string,
}

export type SpectrumProperties = {
	css: CSSViewportSet,
	spectrumSet: SpectrumSet,
	inlineStyle: InlineStyleSet,
}

export type SpectrumState = {
	valids: ViewportStyle,
	saves: ViewportStyle,
	changes: ViewportStyle,
	removes: ViewportStyle,
	rendererPropertySet: RendererPropertySet,
	isSaving: boolean,
	viewport: number,
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
	init: InitSet,
	saves: clientViewportSets,
	changes: clientViewportSets,
	removes: clientViewportSets,
	valids: clientViewportSets,
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
	viewportType?: ViewportType,
	size?: Size,
	attributes?: Attributes,
	props?: Array<string>,
	prop?: string,
	callback?: Function,
	force?: boolean,
	priority?: number,
	selectors?: SelectorSet,
	mapping?: RendererMapping,
	position?: string,
}

export type Reducers = {
	[ key : string ] : Function,
}

export type ReducerManager = {
	reducer: Function,
	addReducer: Function,
}

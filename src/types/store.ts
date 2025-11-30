import type { Size } from '@quantum-viewports/hooks';
import type {
	clientId,
	BlockStyles,
	BlockAttributes
} from './';

export type ViewportsConfig = {
	distribution: string;
	version: string;
}


export type viewportType = 'desktop' | 'tablet' | 'mobile' | '';
export type deviceType = 'Desktop' | 'Tablet' | 'Mobile' | '';
export type viewport = number|string;
export type Viewports = {
	[ key: viewport ] : string,
}


export type ClientViewportSets = {
	[ key: clientId ] : ViewportStyleSets,
}
export type ViewportStyleSets = {
	[ key: viewport ] : ViewportStyleSet;
}
export type ViewportStyleSet = {
	style?: BlockStyles,
	to?: number
}


export type BlockDifferences = {
	changes: ViewportStyleSet,
	removes: ViewportStyleSet,
}

export type RendererPropertySet = {
	[ key: string ] : RendererSet,
}

export type RendererSet = {
	[ key: number ] : {
		type?: string,
		callback: Function,
		groupId?: string,
		panelId?: string,
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
	declarations: string,
	css: string,
	style: BlockStyles,
	properties: CSSProperties,
	saves: BlockStyles,
	savesProperties: CSSProperties,
	hasSaves: boolean,
	changes: BlockStyles,
	changesProperties: CSSProperties,
	hasChanges: boolean,
	removes: BlockStyles,
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
	cssViewportSet: CSSViewportSet,
	spectrumSet: SpectrumSet,
}

export type SpectrumState = {
	valids: ViewportStyleSets,
	saves: ViewportStyleSets,
	changes: ViewportStyleSets,
	removes: ViewportStyleSets,
	rendererPropertySet: RendererPropertySet,
	isSaving: boolean,
	viewport: number,
}

export type IndicatorPropertySet = {
	[ key : string ] : {
		property: Array<string>|string,
		groupId: string,
		panelId: string,
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
	saves: ClientViewportSets,
	changes: ClientViewportSets,
	removes: ClientViewportSets,
	valids: ClientViewportSets,
	inspect: object | boolean,
	lastEdit: number,
	renderer: RendererPropertySet,
	cssSet: CSSViewportSets,
	spectrumSets: SpectrumSets,
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
	groupId?: string,
	panelId?: string,
	props?: Array<string>,
	prop?: string,
	callback?: Function,
	force?: boolean,
	priority?: number,
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

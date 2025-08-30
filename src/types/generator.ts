import type {
	BlockStyles,
	SelectorSet,
	ViewportStyleSets,
	InlineStyleSet,
	RendererPropertySet,
} from './';

export type CSSCollection = {
	selector: string,
	declarations: string,
};

export type CSSCollectionSet = Array<CSSCollection>

export type CSSProperties = {
	[ key : string ]: string,
};

export type CSSViewport = {
	[ key : number ]: string,
}

export type CSSViewportSet = {
	[ key : number ]: Array<CSSViewport>,
};

export type CSSViewportSets = {
	[ key : string ]: CSSViewportSet,
}

export interface Spectrum {
	type: string,
	blockName: string,
	property: string,
	priority: number,
	viewport: number,
	from: number,
	to: number,
	media: string,
	hasMediaChange: boolean,
	selector: string,
	selectors: SelectorSet,
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

export type SpectrumSet = Array<Spectrum>;

export type SpectrumSets = {
	[ key : string ] : SpectrumSet,
};

export type SpectrumProperties = {
	cssViewportSet: CSSViewportSet,
	spectrumSet: SpectrumSet,
	inlineStyle: InlineStyleSet,
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
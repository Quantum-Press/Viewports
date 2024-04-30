import type { Styles } from '../store';

export type RuleSet = Array<Rule>;

export interface Rule {
	property: string;
	viewport: number;
	priority: number;
	selector: string;
	css: string;
	style: Styles;
	properties: {
		[ key: string ] : string,
	};
}

export type SpectrumSet = Array<Spectrum>;

export interface Spectrum extends Rule {
	from: number;
	to: number;
	media: string
}

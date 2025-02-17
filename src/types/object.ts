export type AnyObject = Record<string, any>;

export type DeepPartial<T> = T extends (infer U)[] // If T is an Array
	? DeepPartial<U>[] // Set DeepPartial recursively on elements type
	: T extends object // If T is an object
	? { [K in keyof T]?: DeepPartial<T[K]> } // Set DeepPartial on all keys
	: T; // Otherwise its itself
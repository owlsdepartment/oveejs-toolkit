const hasOwn = Object.prototype.hasOwnProperty;

export type ClassNameDictionary = Record<string, unknown>;
export type ClassNameInput =
	| string
	| number
	| boolean
	| null
	| undefined
	| ClassNameDictionary
	| ClassNameInput[];

export function classNames(...args: ClassNameInput[]): string {
	let classes = '';

	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg) {
			classes = appendClass(classes, parseValue(arg));
		}
	}

	return classes;
}

function parseValue(arg: ClassNameInput): string {
	if (typeof arg === 'string') {
		return arg;
	}

	if (typeof arg !== 'object' || arg === null || arg === undefined) {
		return '';
	}

	if (Array.isArray(arg)) {
		return classNames(...arg);
	}

	if (
		arg.toString !== Object.prototype.toString &&
		!arg.toString.toString().includes('[native code]')
	) {
		return arg.toString();
	}

	let classes = '';

	for (const key in arg) {
		if (hasOwn.call(arg, key) && arg[key]) {
			classes = appendClass(classes, key);
		}
	}

	return classes;
}

function appendClass(value: string, newClass: string): string {
	if (!newClass) {
		return value;
	}

	return value ? `${value} ${newClass}` : newClass;
}

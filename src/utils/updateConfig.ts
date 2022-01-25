import { defaultsDeep } from 'lodash';

type AnyObject = Record<string, any>;

export interface ClassWithConfig<Config> extends Function {
	new (...args: any[]): any;

	config: Config;
}

export function updateConfig<Ctor extends ClassWithConfig<AnyObject>>(
	ctor: Ctor,
	config?: Partial<Ctor['config']>
): void {
	if (!config) return;

	ctor.config = defaultsDeep({}, config, ctor.config);
}

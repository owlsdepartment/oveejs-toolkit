import { defaultsDeep, isUndefined } from 'lodash';

type AnyObject = Record<string, any>;

export interface ClassWithConfig<Config> extends Function {
	new (...args: any[]): any;

	config: Config;
}

interface WithConfig {
	config: any;
}

export function updateConfig<Base extends WithConfig, Config = Base['config']>(
	base: Base,
	config?: Config extends AnyObject ? Partial<Config> : Config
): void {
	if (isUndefined(config)) return;

	base.config = defaultsDeep({}, config, base.config);
}

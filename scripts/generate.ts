import { Command } from 'commander';

import { generateComponent } from './generate/component';
import { generateModule } from './generate/module';
import { generateTool } from './generate/tool';

const program = new Command();

program
	.command('component')
	.alias('c')
	.description('generate boilerplate for new component')
	.argument('<path>', 'component path. If used alone, component name will be infered')
	.argument('[name]', 'component name')
	.option('-s, --styles', 'generate styles file', false)
	.action(async (path: string, name: string | undefined, options: { styles: boolean }) => {
		await generateComponent(path, name ?? '', options.styles);
	});

program
	.command('module')
	.alias('m')
	.description('generate boilerplate for new module')
	.argument('<path>', 'module path. If used alone, module name will be infered')
	.argument('[name]', 'module name')
	.action(async (path: string, name: string | undefined) => {
		await generateModule(path, name ?? '');
	});

program
	.command('tool')
	.alias('t')
	.description('generate boilerplate for new tool')
	.argument('<path>', 'path for tool. Tools default name will be a final part of path')
	.action(async (path: string) => {
		await generateTool(path);
	});

/**
 * Format:
 * yarn run generate <what> <path> [name]
 */
function init() {
	program.parse();
}

init();

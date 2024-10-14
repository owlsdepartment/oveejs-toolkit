import { Command } from 'commander';

import { generateComponent } from './generate/component';
import { generateModule } from './generate/module';
import { WithIntegrations, WithStyles } from './generate/options';
import { generateTool } from './generate/tool';

const program = new Command();

program
	.command('component')
	.alias('c')
	.description('generate boilerplate for new component')
	.argument('<path>', 'component path. If used alone, component name will be infered')
	.argument('[name]', 'component name')
	.option('-s, --styles', 'generate styles file', false)
	.option('-i, --integrations', `output component to 'integrations' package`, false)
	.action(
		async (path: string, name: string | undefined, options: WithStyles & WithIntegrations) => {
			await generateComponent(path, name ?? '', options);
		}
	);

program
	.command('module')
	.alias('m')
	.description('generate boilerplate for new module')
	.argument('<path>', 'module path. If used alone, module name will be infered')
	.argument('[name]', 'module name')
	.option('-s, --styles', 'generate styles file', false)
	.option('-i, --integrations', `output module to 'integrations' package`, false)
	.action(
		async (path: string, name: string | undefined, options: WithStyles & WithIntegrations) => {
			await generateModule(path, name ?? '', options);
		}
	);

program
	.command('tool')
	.alias('t')
	.description('generate boilerplate for new tool')
	.argument('<path>', 'path for tool. Tools default name will be a final part of path')
	.option('-i, --integrations', `output tool to 'integrations' package`, false)
	.action(async (path: string, options: WithIntegrations) => {
		await generateTool(path, options);
	});

/**
 * Format:
 * yarn run generate <what> <path> [name]
 */
function init() {
	program.parse();
}

init();

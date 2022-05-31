import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import tsPlugin from '@rollup/plugin-typescript';
import esbuildAlias from 'esbuild-plugin-alias';
import fs from 'fs';
import path from 'path';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

const ROOT_PATH = path.resolve(__dirname, '..');
const SRC_PATH = path.resolve(__dirname, '../src');
const DIST_PATH = path.resolve(__dirname, '../dist');

// const bundle = format => ({
// 	input: 'index.ts',

// 	output: {
// 		sourcemap: false,
// 		file: `dist/index.${format == 'dts' ? 'd.ts' : 'js'}`,
// 		format: format == 'dts' ? 'esm' : 'cjs',
// 		exports: 'named',
// 	},

// 	plugins: format == 'dts' ? [dts()] : [esbuild({ target: 'es2020' })],

// 	external: id => !/^[./]/.test(id),
// });

// export default [bundle('cjs'), bundle('dts')];
build();

async function build() {
	// let bundle;
	// let buildFailed = false;
	// try {
	// 	// create a bundle
	// 	bundle = await rollup({ input: 'index.ts' });

	// 	// an array of file names this bundle depends on
	// 	console.log(bundle.watchFiles);

	// 	await generateOutputs(bundle);
	// } catch (error) {
	// 	buildFailed = true;
	// 	// do some error reporting
	// 	console.error(error);
	// }
	// if (bundle) {
	// 	// closes the bundle
	// 	await bundle.close();
	// }
	// process.exit(buildFailed ? 1 : 0);

	fs.rmdirSync(DIST_PATH, { recursive: true });

	const formats = ['es', 'cjs'] as const;

	for (const format of formats) {
		const bundle = await rollup({
			input: path.resolve(SRC_PATH, 'index.ts'),
			external: id => !/^(@\/|[./])/.test(id),
			plugins: [
				typescriptPaths({
					tsConfigPath: path.resolve(ROOT_PATH, 'tsconfig.json'),
					preserveExtensions: true,
				}),
				esbuild({ target: 'es2020' }),
			],
		});

		await bundle.generate({});
		await bundle.write({
			format,

			file: path.resolve(DIST_PATH, format === 'es' ? 'index.mjs' : 'index.cjs'),
		});
	}

	await generateDTS();
	await genTest();
}

async function generateDTS() {
	const bundle = await rollup({
		input: path.resolve(SRC_PATH, 'index.ts'),
		external: id => !/^(@\/|[./])/.test(id),
		plugins: [
			typescriptPaths({
				tsConfigPath: path.resolve(ROOT_PATH, 'tsconfig.json'),
				preserveExtensions: true,
			}),
			dts(),
		],
	});

	await bundle.generate({});
	await bundle.write({
		file: path.resolve(DIST_PATH, `index.d.ts`),
		format: 'es',
	});
	await bundle.close();
}

async function genTest() {
	const formats = ['es', 'cjs'] as const;

	for (const format of formats) {
		const bundle = await rollup({
			input: path.resolve(SRC_PATH, 'test.ts'),
			external: id => !/^(@\/|[./])/.test(id),
			plugins: [
				typescriptPaths({
					tsConfigPath: path.resolve(ROOT_PATH, 'tsconfig.json'),
					preserveExtensions: true,
				}),
				esbuild({ target: 'es2020' }),
			],
		});

		await bundle.generate({});
		await bundle.write({
			format,

			file: path.resolve(DIST_PATH, format === 'es' ? 'test.mjs' : 'test.cjs'),
		});
	}

	const bundle = await rollup({
		input: path.resolve(SRC_PATH, 'test.ts'),
		external: id => !/^(@\/|[./])/.test(id),
		plugins: [
			typescriptPaths({
				tsConfigPath: path.resolve(ROOT_PATH, 'tsconfig.json'),
				preserveExtensions: true,
			}),
			dts(),
		],
	});

	await bundle.generate({});
	await bundle.write({
		file: path.resolve(DIST_PATH, `test.d.ts`),
		format: 'es',
	});
	await bundle.close();
}

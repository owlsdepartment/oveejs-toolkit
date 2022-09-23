import fs, { existsSync } from 'fs';
import { kebabCase } from 'lodash';
import path from 'path';
import { createInterface } from 'readline';
import { ExternalOption, rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

interface PackageEntry {
	name: string;
	rootPath: string;
	external?: ExternalOption;
	autoStyles?: boolean;
	files: FileEntry[];
}

interface FileEntry {
	name: string;
	path: string;
}

const ROOT_PATH = path.resolve(__dirname, '..');
const CORE_PATH = path.resolve(ROOT_PATH, 'packages/core');
const INTEGRATIONS_PATH = path.resolve(ROOT_PATH, 'packages/integrations');
const TSCONFIG = path.resolve(ROOT_PATH, 'tsconfig.json');
const DIST_FOLDER = 'dist';
const DIST_STYLES_FOLDER = `${DIST_FOLDER}/styles`;
const STYLES_NAME = 'styles.scss';
const FORMATS = ['es', 'cjs'] as const;
const FILES_TO_COPY_LOCAL = ['package.json', 'README.md'];
const FILES_TO_COPY_ROOT = ['LICENSE'];

const packages: PackageEntry[] = [
	{
		name: 'core',
		rootPath: CORE_PATH,
		external: id => !/^(@ovee\.js\/toolkit|[./])/.test(id),
		autoStyles: true,
		files: [{ name: 'index', path: 'index.ts' }],
	},
	{
		name: 'integrations',
		rootPath: INTEGRATIONS_PATH,
		files: [
			...fs
				.readdirSync(INTEGRATIONS_PATH, { withFileTypes: true })
				.filter(dir => dir.isDirectory() && dir.name !== DIST_FOLDER)
				.map(dir => ({ name: dir.name, path: `${dir.name}/index.ts` })),

			{ name: 'index', path: 'index.ts' },
		],
	},
];

build();

async function build() {
	console.log('[BUILD] Build all packages...\n');

	for (const p of packages) {
		await bundle(p);
	}

	console.log('[BUILD] Finished build process!');
}

async function bundle(entry: PackageEntry) {
	const { name, files, rootPath } = entry;
	let { external } = entry;

	console.log(`[BUILD] Bundling package '${name}'...`);

	external ??= id => !/^[./]/.test(id);

	prepareDist(rootPath);

	for (const file of files) {
		console.log(`[BUILD] -- processing entry '${file.name}'`);

		const input = path.resolve(rootPath, file.path);

		for (const format of FORMATS) {
			const bundle = await rollup({
				input,
				external,

				plugins: [
					typescriptPaths({
						tsConfigPath: TSCONFIG,
						preserveExtensions: true,
					}),
					esbuild({ target: 'es2020' }),
				],
			});

			await bundle.generate({});
			await bundle.write({
				format,

				file: path.resolve(rootPath, DIST_FOLDER, getDistFileName(format, file.name)),
			});
		}

		await generateDTS(input, path.resolve(rootPath, DIST_FOLDER, `${file.name}.d.ts`), external);

		if (existsSync(path.resolve(rootPath, file.path, `../${STYLES_NAME}`))) {
			bundleStyles(
				entry,
				path.resolve(rootPath, file.path, '..'),
				file.name === 'index' ? '' : file.name
			);
		}
	}

	copyStaticFiles(rootPath);

	if (entry.autoStyles) {
		forEachModuleDirectory(rootPath, dirPath => {
			if (existsSync(path.resolve(dirPath, STYLES_NAME))) {
				bundleStyles(entry, dirPath);
			}
		});
	}

	console.log(`[BUILD] Package '${name}' bundled!\n`);
}

async function generateDTS(input: string, output: string, external: ExternalOption) {
	const bundle = await rollup({
		input,
		external,

		plugins: [
			typescriptPaths({
				tsConfigPath: TSCONFIG,
				preserveExtensions: true,
			}),
			dts(),
		],
	});

	await bundle.generate({});
	await bundle.write({
		format: 'es',
		file: output,
	});
	await bundle.close();
}

async function bundleStyles(entry: PackageEntry, stylesDir: string, name = '') {
	const stylesDist = path.resolve(entry.rootPath, DIST_STYLES_FOLDER);
	const inputFile = path.resolve(stylesDir, STYLES_NAME);

	if (!name) {
		const rs = fs.createReadStream(path.resolve(stylesDir, 'README.md'));
		let heading = '';
		const errMessage = `There was a problem while getting styles name for '${stylesDir}'`;

		try {
			for await (const line of createInterface(rs)) {
				if (line.startsWith('# ')) {
					heading = line;
					break;
				}
			}
		} catch (e) {
			console.error(errMessage, e);
		}

		rs.destroy();

		if (!heading) {
			console.error(errMessage);

			return;
		}

		name = heading.slice(2);
	}

	name = kebabCase(name);

	fs.copyFileSync(inputFile, path.resolve(stylesDist, `${name}.scss`));
}

function prepareDist(packageFolder: string) {
	const distPath = path.resolve(packageFolder, DIST_FOLDER);

	if (existsSync(distPath)) {
		fs.rmSync(distPath, { recursive: true });
	}

	fs.mkdirSync(distPath);
	fs.mkdirSync(path.resolve(packageFolder, DIST_STYLES_FOLDER));
}

function getDistFileName(format: typeof FORMATS[number], fileName: string) {
	return format === 'es' ? `${fileName}.mjs` : `${fileName}.cjs`;
}

async function copyStaticFiles(packageFolder: string) {
	const dist = path.resolve(packageFolder, DIST_FOLDER);

	for (const file of FILES_TO_COPY_ROOT) {
		fs.copyFileSync(path.resolve(ROOT_PATH, file), path.resolve(dist, file));
	}

	for (const file of FILES_TO_COPY_LOCAL) {
		fs.copyFileSync(path.resolve(packageFolder, file), path.resolve(dist, file));
	}
}

function forEachModuleDirectory(root: string, cb: (fullPath: string) => void) {
	const searchUp = (base: string) => {
		getAllDirectories(base).forEach(dir => {
			const dirPath = path.resolve(base, dir.name);

			if (existsSync(path.resolve(dirPath, 'README.md'))) {
				cb(dirPath);
			} else {
				searchUp(dirPath);
			}
		});
	};

	searchUp(root);
}

function getAllDirectories(path: string) {
	return fs
		.readdirSync(path, { withFileTypes: true })
		.filter(dir => dir.isDirectory() && dir.name !== DIST_FOLDER);
}

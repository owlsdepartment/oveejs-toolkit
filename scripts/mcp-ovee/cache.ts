import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OVEE_REPO = 'https://github.com/owlsdepartment/ovee.git';
const OVEE_BRANCH = 'v3';
const DOCS_BASE = 'https://owlsdepartment.github.io/ovee/v3/';

export function getWorkspaceRoot(): string {
	const env = process.env.WORKSPACE_ROOT;
	if (env) {
		return path.resolve(env);
	}
	return process.cwd();
}

export function getCachePaths(cwd: string) {
	const root = path.resolve(cwd, '.cache', 'ovee-mcp');
	return {
		root,
		src: path.join(root, 'src'),
		docs: path.join(root, 'docs'),
	};
}

function assertSafePath(abs: string, root: string) {
	const normAbs = path.normalize(abs);
	const normRoot = path.normalize(root);
	if (!normAbs.startsWith(normRoot + path.sep) && normAbs !== normRoot) {
		throw new Error(`Unsafe path: ${abs}`);
	}
}

export function ensureSrcClone(cwd: string) {
	const { src } = getCachePaths(cwd);
	if (fs.existsSync(path.join(src, '.git'))) {
		return;
	}
	fs.mkdirSync(path.dirname(src), { recursive: true });
	execFileSync(
		'git',
		['clone', '--depth', '1', '--branch', OVEE_BRANCH, OVEE_REPO, src],
		{ stdio: 'inherit' }
	);
}

export function pullSrc(cwd: string) {
	const { src } = getCachePaths(cwd);
	if (!fs.existsSync(path.join(src, '.git'))) {
		ensureSrcClone(cwd);
		return;
	}
	execFileSync('git', ['-C', src, 'pull', '--ff-only'], { stdio: 'inherit' });
}

export function readSrcFile(cwd: string, relPath: string): string {
	const { src } = getCachePaths(cwd);
	ensureSrcClone(cwd);
	const abs = path.resolve(src, relPath);
	assertSafePath(abs, src);
	if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
		throw new Error(`Not a file: ${relPath}`);
	}
	return fs.readFileSync(abs, 'utf8');
}

export function listSrcDir(cwd: string, relPath: string): { name: string; type: 'file' | 'dir' }[] {
	const { src } = getCachePaths(cwd);
	ensureSrcClone(cwd);
	const abs = path.resolve(src, relPath || '.');
	assertSafePath(abs, src);
	if (!fs.existsSync(abs)) {
		throw new Error(`Missing path: ${relPath}`);
	}
	return fs.readdirSync(abs, { withFileTypes: true }).map(d => ({
		name: d.name,
		type: d.isDirectory() ? 'dir' : 'file',
	}));
}

export function searchSrc(
	cwd: string,
	pattern: string,
	subPath?: string,
	glob?: string
): { path: string; line: number; text: string }[] {
	const { src } = getCachePaths(cwd);
	ensureSrcClone(cwd);
	const searchRoot = subPath ? path.resolve(src, subPath) : src;
	assertSafePath(searchRoot, src);
	const args = ['--json', '--line-number', '--color', 'never', pattern, searchRoot];
	if (glob) {
		args.push('--glob', glob);
	}
	const r = spawnSync('rg', args, { encoding: 'utf8' });
	if (r.error && (r.error as NodeJS.ErrnoException).code === 'ENOENT') {
		throw new Error('rg (ripgrep) is not installed or not on PATH');
	}
	if (r.status === 1) {
		return [];
	}
	if (r.status !== 0) {
		throw new Error(r.stderr || `rg exited ${r.status}`);
	}
	const out: { path: string; line: number; text: string }[] = [];
	for (const line of r.stdout.split('\n')) {
		if (!line.trim()) continue;
		try {
			const row = JSON.parse(line) as { type?: string; data?: { path?: { text: string }; line_number?: number; lines?: { text: string } } };
			if (row.type === 'match' && row.data?.path?.text && row.data.line_number != null) {
				const rel = path.relative(src, row.data.path.text);
				out.push({
					path: rel,
					line: row.data.line_number,
					text: (row.data.lines?.text ?? '').trimEnd(),
				});
			}
		} catch {
			continue;
		}
	}
	return out;
}

function htmlToText(html: string) {
	return html
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<[^>]+>/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

async function fetchFirstOk(urls: string[]) {
	let lastErr: string | undefined;
	for (const url of urls) {
		const res = await fetch(url, { redirect: 'follow' });
		if (res.ok) {
			return { url, body: await res.text() };
		}
		lastErr = `${res.status} ${res.statusText}`;
	}
	throw new Error(lastErr ?? 'fetch failed');
}

export async function getOrFetchDoc(cwd: string, slug: string): Promise<{ slug: string; markdown: string }> {
	const { docs } = getCachePaths(cwd);
	fs.mkdirSync(docs, { recursive: true });
	const safeSlug = slug.replace(/^\/+/, '').replace(/\.\./g, '') || 'index';
	const cacheFile = path.join(docs, `${safeSlug.replace(/\//g, '__')}.md`);
	if (fs.existsSync(cacheFile)) {
		return { slug: safeSlug, markdown: fs.readFileSync(cacheFile, 'utf8') };
	}
	const base = DOCS_BASE.endsWith('/') ? DOCS_BASE : `${DOCS_BASE}/`;
	const candidates = [
		`${base}${safeSlug}.html`,
		`${base}${safeSlug}/index.html`,
		`${base}${safeSlug}/`,
		`${base}${safeSlug}`,
	];
	const { url, body } = await fetchFirstOk(candidates);
	const md = `# ${safeSlug}\n\nSource: ${url}\n\n${htmlToText(body)}`;
	fs.writeFileSync(cacheFile, md, 'utf8');
	return { slug: safeSlug, markdown: md };
}

export function clearDocsCache(cwd: string) {
	const { docs } = getCachePaths(cwd);
	if (fs.existsSync(docs)) {
		fs.rmSync(docs, { recursive: true, force: true });
	}
}

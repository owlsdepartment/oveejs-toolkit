import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { readSrcFile } from '../cache';

export function registerGetFileTool(server: McpServer, cwd: string) {
	server.registerTool(
		'ovee_get_file',
		{
			description: 'Read a file from the cached Ovee v3 repo (path relative to repo root).',
			inputSchema: {
				path: z.string().describe('e.g. packages/ovee/src/jsx/runtime/renderer.ts'),
			},
		},
		async ({ path }) => {
			const content = readSrcFile(cwd, path);
			return {
				content: [{ type: 'text', text: JSON.stringify({ path, content }) }],
			};
		}
	);
}

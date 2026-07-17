import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { listSrcDir } from '../cache';

export function registerListDirTool(server: McpServer, cwd: string) {
	server.registerTool(
		'ovee_list_dir',
		{
			description: 'List a directory under the cached Ovee v3 repo.',
			inputSchema: {
				path: z.string().optional().describe('Relative directory; default root'),
			},
		},
		async ({ path: rel = '' }) => {
			const entries = listSrcDir(cwd, rel);
			return {
				content: [{ type: 'text', text: JSON.stringify({ path: rel, entries }) }],
			};
		}
	);
}

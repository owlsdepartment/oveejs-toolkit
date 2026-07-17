import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { searchSrc } from '../cache';

export function registerSearchTool(server: McpServer, cwd: string) {
	server.registerTool(
		'ovee_search',
		{
			description: 'Ripgrep the cached Ovee v3 source (requires rg on PATH).',
			inputSchema: {
				pattern: z.string(),
				path: z.string().optional().describe('Subpath under repo root'),
				glob: z.string().optional(),
			},
		},
		async ({ pattern, path: subPath, glob }) => {
			const hits = searchSrc(cwd, pattern, subPath, glob);
			return {
				content: [{ type: 'text', text: JSON.stringify({ hits }) }],
			};
		}
	);
}

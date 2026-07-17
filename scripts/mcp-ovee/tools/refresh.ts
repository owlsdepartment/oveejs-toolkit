import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { clearDocsCache, pullSrc } from '../cache';

export function registerRefreshTool(server: McpServer, cwd: string) {
	server.registerTool(
		'ovee_refresh',
		{
			description: 'Refresh cached Ovee v3 source (git pull) and/or docs cache.',
			inputSchema: {
				scope: z.enum(['all', 'src', 'docs']).optional().default('all'),
			},
		},
		async ({ scope }) => {
			if (scope === 'all' || scope === 'src') {
				pullSrc(cwd);
			}
			if (scope === 'all' || scope === 'docs') {
				clearDocsCache(cwd);
			}
			return {
				content: [{ type: 'text', text: JSON.stringify({ ok: true, scope }) }],
			};
		}
	);
}

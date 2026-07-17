import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getOrFetchDoc } from '../cache';

export function registerGetDocTool(server: McpServer, cwd: string) {
	server.registerTool(
		'ovee_get_doc',
		{
			description: 'Fetch an Ovee v3 docs page (HTML) and return cached markdown.',
			inputSchema: {
				slug: z.string().describe('e.g. api or guide/getting-started'),
			},
		},
		async ({ slug }) => {
			const doc = await getOrFetchDoc(cwd, slug);
			return {
				content: [{ type: 'text', text: JSON.stringify(doc) }],
			};
		}
	);
}

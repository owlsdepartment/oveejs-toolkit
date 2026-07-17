import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { ensureSrcClone, getWorkspaceRoot } from './cache';
import { registerGetDocTool } from './tools/getDoc';
import { registerGetFileTool } from './tools/getFile';
import { registerListDirTool } from './tools/listDir';
import { registerRefreshTool } from './tools/refresh';
import { registerSearchTool } from './tools/search';

const cwd = getWorkspaceRoot();

const server = new McpServer(
	{ name: 'ovee-docs', version: '0.1.0' },
	{ instructions: 'Cached Ovee.js v3 source (GitHub) and docs (owlsdepartment.github.io/ovee/v3).' }
);

registerGetFileTool(server, cwd);
registerListDirTool(server, cwd);
registerSearchTool(server, cwd);
registerGetDocTool(server, cwd);
registerRefreshTool(server, cwd);

ensureSrcClone(cwd);

const transport = new StdioServerTransport();
await server.connect(transport);

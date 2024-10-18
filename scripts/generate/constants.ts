import path from 'path';

export const PACKAGE_CORE = 'packages/core';
export const PACKAGE_INTEGRATIONS = 'packages/integrations';
export const COMPONENTS_DIR = 'components';
export const OTHER_COMPONENTS_DIR = `${COMPONENTS_DIR}/other`;
export const MODULES_DIR = 'modules';
export const OTHER_MODULES_DIR = `${MODULES_DIR}/other`;
export const TOOLS_DIR = 'tools';
export const ROOT_DIR = path.resolve(__dirname, '..');
export const README_TEMPLATE = path.resolve(ROOT_DIR, 'scripts/templates/readme_template.md');

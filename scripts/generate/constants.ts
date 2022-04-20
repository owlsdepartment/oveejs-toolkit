import path from 'path';

export const COMPONENTS_DIR = 'src/components';
export const OTHER_COMPONENTS_DIR = `${COMPONENTS_DIR}/other`;
export const MODULES_DIR = 'src/modules';
export const OTHER_MODULES_DIR = `${MODULES_DIR}/other`;
export const TOOLS_DIR = 'src/tools';
export const ROOT_DIR = path.resolve(__dirname, '..');
export const README_TEMPLATE = path.resolve(ROOT_DIR, '.github/readme_template.md');

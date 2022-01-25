import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect, ComponentContext } from '@teambit/generator';
import { OveeAspect } from './ovee.aspect';

export class OveeMain {
  static slots = [];
  static dependencies = [GeneratorAspect];
  static runtime = MainRuntime;
  static async provider([generator]: [GeneratorMain]) {
  /**
  * Array of templates. Add as many templates as you want
  * Separate the templates to multiple files if you prefer
  * Modify, add or remove files as needed
  * See the docs file of this component for more info
  */

  generator.registerComponentTemplate([
    {
      name: 'ovee-component',
      description: 'Create base Ovee component',
      generateFiles: (context: ComponentContext) => {
        return [

          // index file
          {
            relativePath: 'index.ts',
            isMain: true,
            content: `export { ${context.namePascalCase} } from './${context.name}';
`,
          },

          // component file
          {
            relativePath: `${context.name}.ts`,
            content: `import { Component, register } from 'ovee.js';

@register('${context.name}')
export class ${context.namePascalCase} extends Component {
}
`,
          },

          // docs file
          {
            relativePath: `${context.name}.docs.mdx`,
            content: `---
description: 'An Ovee Component for rendering text.'
labels: ['text', 'ui']
---

import { ${context.namePascalCase} } from './${context.name}';
`
          },
          // add more files here such as css/sass
        ];
      },
    },

    // component 2
    {
        name: 'component2',
        description: 'description for component2',
        generateFiles: (context: ComponentContext) => {
          return [

            // index file
            {
              relativePath: 'index.ts',
              isMain: true,
              content: `export {} from '';
`,
            },
          ]
        }
      }
    ]);

    return new OveeMain();
  }
}

OveeAspect.addRuntime(OveeMain);

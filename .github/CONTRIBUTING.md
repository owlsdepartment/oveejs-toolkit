# Contributing

## Local development

To start local developemnt

1. Clone the project

```bash
git clone git@github.com:owlsdepartment/owlsdepartment-components.git
```

2. Install dependencies

```bash
yarn
```

3. Done!

If you're using VS Code, you can use preconfigured workspace file: `owlsdeparment-components.code-workspace`.

## Writing components

<!-- TODO: -->
Components are self-contained folders, placed in `src/components` folder.

Folder must contain:
 - `README.md` file with documentation and examples, based on [template](/.github/readme_template.md)
 - `index.ts` file, that either defines full component (if there isn't much code) or exports all things you want to expose to the world

Folder can contain:
 - `style.scss` file with component styling

Folder can contain other script or style files, but they need to be imported inside either `style.scss` or `index.ts`.

### Good practices

<!-- TODO: -->

## Commiting and making a pull request

You should always work with your components on seperate branch, forked from `master` branch, which will be protected. New changes will be done only via reviewed pull requests.

Commits has to meet [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification in [Angular](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format) format. Read those links for in depth information.

Angular flavour specifies for us certain types of commits:

 - __build__: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
 - __ci__: Changes to our CI configuration files and scripts (examples: CircleCi, SauceLabs)
 - __docs__: Documentation only changes
 - __feat__: A new feature
 - __fix__: A bug fix
 - __perf__: A code change that improves performance
 - __refactor__: A code change that neither fixes a bug nor adds a feature
 - __test__: Adding missing tests or correcting existing tests

You should also include what scope you are working on. In case of components, it should be component name, f.ex.:

```bash
git commit -m "feat(in-viewport): init InViewport component"

# or

git commit -m "fix(in-viewport): fixed bug where InViewport was called only once"
```

Don't worry tho, there will be a commit message linter, that will warn you, if your commit message won't meet the specification.





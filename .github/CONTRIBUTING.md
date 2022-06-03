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

If you're using VS Code, you can use preconfigured workspace file: `ovee-toolkit.code-workspace`.

## Writing components and other

<!-- TODO: -->
Components are self-contained folders, placed in `src/components` folder.

Folder must contain:
 - `README.md` file with documentation and examples, based on [template](/scripts/templates/readme_template.md)
 - `index.ts` file, that either defines full component (if there isn't much code) or exports all things you want to expose to the world

Folder can contain:
 - `styles.scss` file with component styling

Folder can contain other script or style files, but they need to be imported inside either `styles.scss` or `index.ts`.

Other tools can either go to: `modules`, `mixins` or `tools`. Structure and rules are the same as for components, with exception of `styles.scss`. Only modules can contain styles.

There is a tool included for generating boilerplate code. To run it, just type in root `yarn generate` and you will get all possible commands with instructions on how to use them.

### Good practices

<!-- TODO: -->

## Commiting and making a pull request

You should always work with your components on seperate branch, forked from `master` branch, which will be protected. New changes will be done only via reviewed pull requests.

Commits has to meet [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification with [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) specification. It's similar to [Angular](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format) format. Read those links for in depth information.

possible types of commits:
 - __build__: Changes that affect the build system or external dependencies (f.ex.: `yarn`, `npm`)
 - __chore__: Changes, that don't affect source code, but repository configuration and development expierience (f.ex: adding new linter or new IDE config)
 - __ci__: Changes to our CI configuration files and scripts (f.ex.: `Gihub Actions`)
 - __docs__: Documentation only changes
 - __feat__: A new feature
 - __fix__: A bug fix
 - __perf__: A code change that improves performance
 - __refactor__: A code change that neither fixes a bug nor adds a feature
 - __revert__: A commit that reverts other commits
 - __style__: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
 - __test__: Adding missing tests or correcting existing tests

You should also include what scope you are working on. In case of components, it should be component name, f.ex.:

```bash
git commit -m "feat(in-viewport): init InViewport component"

# or

git commit -m "fix(in-viewport): fixed bug where InViewport was called only once"
```

Don't worry tho, there is a commit message linter, that will stop you, if your commit message won't meet the specification.

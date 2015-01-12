[![Build Status](https://travis-ci.org/mayo/metalsmith-stencils.svg?branch=master)](https://travis-ci.org/mayo/metalsmith-stencils)

*NOTE: This is work in progress and not functional yet. In the meantime, please use [mayo/metalsmith-templates](https://github.com/mayo/metalsmith-templates)*

# metalsmith-stencils

A metalsmith plugin to render files with templates. This plugin originated in my [fork](https://github.com/mayo/metalsmith-templates) of the original [segmentio/metalsmith-templates](https://github.com/segmentio/metalsmith-templates) plugin. I initially made some changes, but started diverging significantly, and it made more sense to have a separate plugin for my approach.

By default, this plugin will fall back on [consolidate.js](https://github.com/visionmedia/consolidate.js), but is meant to be used with template language specifix extensions.
## Backwards compatibility with metalsmith-templates

This plugin is *mostly*(tm) backwards compatible with metalsmith-templates, with a few caveats:
* It removes/ignores `inPlace` configuration option and instead treats all templates as `inPlace` did, ie. you can use front matter keywords within the template.
* Files that need to be processed as templates need to have templating keyword present in the front matter.
  This is to avoid processing all templates in the source directory as templated, and causing conflict with binary or other files. In the very basic case, each source file needs to have a `template` keyword in front matter with path to a template file. If the source file is a "template" itself, supply `template: true`.

## Installation

    $ npm install metalsmith-stencils

## CLI Usage

  Install the node modules and then add the `metalsmith-stencils` key to your `metalsmith.json` plugins. The simplest use case just requires the template engine you want to use:

```json
{
  "plugins": {
    "metalsmith-stencils": "handlebars"
  }
}
```

  If you want to specify additional options, pass an object:

```json
{
  "plugins": {
    "metalsmith-stencils": {
      "engine": "handlebars",
      "directory": "templates"
    }
  }
}
```

## Javascript Usage

  For the simplest use case, just pass your templating engine:

```js
var templates = require('metalsmith-stencils');

metalsmith.use(templates('swig'));
```

  To specify additional options:

```js
metalsmith.use(templates({
  engine: 'swig',
  directory: 'templates'
}));
```

## License

  MIT

[![Build Status](https://travis-ci.org/mayo/metalsmith-templates.svg?branch=master)](https://travis-ci.org/mayo/metalsmith-templates)

# metalsmith-templates

  A metalsmith plugin to render files with templates.

  You can use any templating engine supported by [consolidate.js](https://github.com/visionmedia/consolidate.js).

## NOTE

This fork of metalsmith-templates removes the `inPlace` keyword and instead treats all files it processes as `inPlace`. Only files with `template` keyword in front mater will be processed. If a content file should be treated as a template itself and does not need an external template file, use `true` for the `template` keyword (`template: true`).

*Please note this breaks backward compatibility in that `inPlace` didn't require content file to specify `template` in front matter.* Creating this incompatibility allows the user to pick which files get processed as templates. This avoids processing binary files as templates, which made use of `inPlace` relatively limited.

Furthermore, it adds `useExtends`, `defaultExtends`, `defaultBlock`, `extendsPattern`, and `blockPattern` options for better support of template engines with inheritance (swig, jade, etc). Specifying `defaultExtends` option or having `extends` keyword in front matter treats the content file as template and inherits the specified template. Specifying `defaultBlock` will wrap the content in a block expression. `blockPattern` and `extendsPattern` need to be specified for each template engine. `useExtends` needs to be specified in options when using `defaultExtends`.

Example:
```js
.use(templates({
  "engine": "swig",
  "directory": "templates",

  "autoescape": false,

  "extendsPattern": '{% extends "%s" %}',
  "blockPattern": [ '{% block %s %}', '{% endblock %}' ]
}))
```

## Installation

    $ npm install metalsmith-templates

## CLI Usage

  Install the node modules and then add the `metalsmith-templates` key to your `metalsmith.json` plugins. The simplest use case just requires the template engine you want to use:

```json
{
  "plugins": {
    "metalsmith-templates": "handlebars"
  }
}
```

  If you want to specify additional options, pass an object:

```json
{
  "plugins": {
    "metalsmith-templates": {
      "engine": "handlebars",
      "directory": "templates"
    }
  }
}
```

## Javascript Usage

  For the simplest use case, just pass your templating engine:

```js
var templates = require('metalsmith-templates');

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

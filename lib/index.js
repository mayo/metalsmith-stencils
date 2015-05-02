
var consolidate = require('consolidate');
var debug = require('debug')('metalsmith-stencils');
var each = require('async').each;
var extend = require('extend');
var match = require('multimatch');
var omit = require('lodash.omit');
var path  = require('path');

var util = require('util');

/**
 * Expose `plugin`.
 */

module.exports = plugin;


/**
 * Settings.
 */

var settings = ['engine', 'directory', 'pattern', 'default', 'useExtends', 'defaultExtends', 'defaultBlock'];

/**
 * Metalsmith plugin to run files through any template in a template `dir`.
 *
 * @param {String or Object} options
 *   @property {String} default (optional)
 *   @property {String} directory (optional)
 *   @property {String} engine
 *   @property {String} pattern (optional)
 *   @property {Boolean} useExtends (optional)
 *   @property {String} defaultExtends (optional)
 *   @property {String} defaultBlock (optional)
 *   @property {String} extendsPattern (optional)
 *   @property {String} blockPattern (optional)
 * @return {Function}
 */

function plugin(opts){
  opts = opts || {};
  if ('string' == typeof opts) opts = { engine: opts };
  if (!opts.engine) throw new Error('"engine" option required');

  var engine = opts.engine;
  var dir = opts.directory || 'templates';
  var pattern = opts.pattern;
  var def = opts.default;

  var useExtends = opts.useExtends;
  var defaultExtends = opts.defaultExtends;
  var defaultBlock = opts.defaultBlock;
  var extendsPattern = opts.extendsPattern;
  var blockPattern = opts.blockPattern;

  if ((defaultExtends) && !useExtends) {
    throw new Error('"useExtends" option required to use defaultExtends or defaultBlock');
  }

  if (useExtends && !extendsPattern) {
    throw new Error('"extendsPattern" required with "useExtends"');
  }

  if (defaultBlock && !blockPattern) {
    throw new Error('"blockPattern" required with "useExtends" and "defaultBlock"');
  }

  if (blockPattern && !(Array.isArray(blockPattern) && blockPattern.length >= 1)) {
    throw new Error('"blockPattern" must be an array with at least one element (block opening pattern).');
  }

  var params = omit(opts, settings);

  return function(files, metalsmith, done){
    var metadata = metalsmith.metadata();

    function check(file){
      var data = files[file];
      var tmpl = data.template || def;
      var ext = useExtends || data.extends ? data.extends || defaultExtends : false;

      if (pattern && !match(file, pattern)[0]) return false;
      if (!tmpl && !ext) return false;
      return true;
    }

    Object.keys(files).forEach(function(file){
      if (!check(file)) return;
      debug('stringifying file: %s', file);
      var data = files[file];
      data.contents = data.contents.toString();
    });

    each(Object.keys(files), convert, done);

    function convert(file, done){
      if (!check(file)) return done();
      debug('converting file: %s', file);
      var data = files[file];
      var clone = extend({}, params, metadata, data);
      var template;
      var renderer;

      if (useExtends || clone.extends) {
        if (!extendsPattern) throw new Error('"extendsPattern" option required with extends');

        clone.extends = data.extends || defaultExtends;
        //fake a filename, make it in templates directory, so rest of templates
        //in inheritance chain can be resolves
        fileStr = file.replace("/", "-");
        clone.filename = path.join(metalsmith.directory(), dir, fileStr + "--" + clone.extends);

        template = util.format(extendsPattern, clone.extends);

        if (defaultBlock) {
          template += util.format(blockPattern[0], defaultBlock);
        }

        template += clone.contents;

        if (defaultBlock && blockPattern.length > 1) {
          template += util.format(blockPattern[1], defaultBlock);
        }

      } else {
        debug("template: %s", data.template);

        if (data.template == true) {
          debug("template == true");
          template = clone.contents;
          clone.filename = path.join(metalsmith.source(), file);

        } else {

          //pre-render the content file
          template = clone.contents;
          clone.filename = path.join(metalsmith.source(), file);

          renderer = consolidate[engine].render;

          clone.contents = "" + render(renderer, template, clone);

          //render the content into template
          debug("meta: %s", Object.keys(clone));
          template = metalsmith.path(dir, data.template || def);
          clone.filename = template;

          fs = require('fs')
          template = "" + fs.readFileSync(template);
        }

      }

      renderer = consolidate[engine].render;
      data.contents = render(renderer, template, clone, done);

    }

    function render(renderer, template, clone, done) {
      var contents;

      renderer(template, clone, function(err, template){
        if (err) return done(err);
        contents = new Buffer(template);
        debug('redered file: %s', clone.filename);

        if (done) {
          done();
        }
      });

      return contents;
    }
  };
}

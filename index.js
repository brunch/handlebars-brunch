var handlebars = require('handlebars');
var umd = require('umd-wrapper');
var sysPath = require('path');

function HandlebarsCompiler(cfg) {
  if (cfg == null) cfg = {};
  this.optimize = cfg.optimize;
  var config = cfg.plugins && cfg.plugins.handlebars;
  if (config) {
    var overrides = config.overrides;
    if (typeof overrides === 'function') overrides(handlebars);
    this.namespace = config.namespace;
    this.pathReplace = config.pathReplace || this.pathReplace;
    if (config.include) this.includeSettings = config.include;
  }
  this.setInclude();
}

HandlebarsCompiler.prototype.setInclude = function() {
  var include = this.includeSettings || {};
  if (include.enabled === false) {
    delete HandlebarsCompiler.prototype.include;
    return;
  }
  var includeFile = 'handlebars';
  if (include.runtime || include.runtime == null) includeFile += '.runtime';
  if (include.amd) includeFile += '.amd';
  if (this.optimize) includeFile += '.min';
  includeFile += '.js';
  HandlebarsCompiler.prototype.include = [
    sysPath.join(__dirname, 'node_modules', 'handlebars', 'dist', includeFile)
  ];
};

HandlebarsCompiler.prototype.brunchPlugin = true;
HandlebarsCompiler.prototype.type = 'template';
HandlebarsCompiler.prototype.extension = 'hbs';
HandlebarsCompiler.prototype.pattern = /\.(?:hbs|handlebars)$/;
HandlebarsCompiler.prototype.pathReplace = /^.*templates\//;

HandlebarsCompiler.prototype.inited = false;
HandlebarsCompiler.prototype.header = '';

HandlebarsCompiler.prototype.compile = function(data, path, callback) {
  if (this.optimize) {
    data = data.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
    data = data.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
  }

  var error, key, ns, result, source, header;
  try {
    source = "Handlebars.template(" + (handlebars.precompile(data)) + ")";

    if (typeof this.namespace === 'function') {
      ns = this.namespace(path);
    } else {
      ns = this.namespace;
    }

    if (ns) {
      header = '';
      if(!this.inited || path === this.header) {
        this.header = path;
        header = "Handlebars.initNS = function(ns, obj) { var global = (function () { return this;})(), levels = ns.split('.'), first = levels.shift(); obj = obj || global; obj[first] = obj[first] || {}; if (levels.length) { Handlebars.initNS(levels.join('.'), obj[first]); } return obj[first]; }; \n";
        this.inited = true;
      }
      key = ns + '.' + path.replace(/\\/g,'/').replace(this.pathReplace, '').replace(/\..+?$/, '').replace(/\//g,'.');
      result = header + "Handlebars.initNS( '" + key + "' ); " + key + " = " + source;
    } else {
      result = umd(source);
    }
  } catch (_error) {
    error = _error;
  }
  if (error) return callback(error);
  return callback(null, result);
};

module.exports = HandlebarsCompiler;

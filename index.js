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

HandlebarsCompiler.prototype.compile = function(data, path, callback) {
  var error, key, ns, result, source;
  try {
    source = "Handlebars.template(" + (handlebars.precompile(data)) + ")";
    if (this.namespace) {
      ns = this.namespace;
      key = path.replace(/\\/g,'/').replace(this.pathReplace, '').replace(/\..+?$/, '');
      result = "if (typeof " + ns + " === 'undefined'){ " + ns + " = {} }; " + ns + "['" + key + "'] = " + source;
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

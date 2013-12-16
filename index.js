var handlebars = require('handlebars');
var umd = require('umd-wrapper');
var sysPath = require('path');

function HandlebarsCompiler(cfg) {
  if (cfg == null) cfg = {};
  var config = cfg.plugins && cfg.plugins.handlebars;
  if (config) {
    var overrides = config.overrides;
    if (typeof overrides === 'function') overrides(handlebars);
    this.namespace = config.namespace;
  }
}

HandlebarsCompiler.prototype.brunchPlugin = true;
HandlebarsCompiler.prototype.type = 'template';
HandlebarsCompiler.prototype.extension = 'hbs';
HandlebarsCompiler.prototype.pattern = /\.(?:hbs|handlebars)$/;

HandlebarsCompiler.prototype.compile = function(data, path, callback) {
  var error, key, ns, result, source;
  try {
    source = "Handlebars.template(" + (handlebars.precompile(data)) + ")";
    result = this.namespace ? (ns = this.namespace, key = path.replace(/^.*templates\//, '').replace(/\..+?$/, ''), "if (typeof " + ns + " === 'undefined'){ " + ns + " = {} }; " + ns + "['" + key + "'] = " + source) : umd(source);
  } catch (_error) {
    error = _error;
  }
  if (error) return callback(error);
  return callback(null, result);
};

HandlebarsCompiler.prototype.include = [
  sysPath.join(__dirname, 'runtime.js')
];

module.exports = HandlebarsCompiler;

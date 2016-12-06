'use strict';

const handlebars = require('handlebars');
const umd = require('umd-wrapper');
const sysPath = require('path');

class HandlebarsCompiler {
  constructor(cfg) {
    this.optimize = cfg.optimize;
    const config = cfg.plugins.handlebars || {};
    const overrides = config.overrides;
    if (typeof overrides === 'function') overrides(handlebars);
    this.namespace = (typeof config.namespace === 'function') ? config.namespace : () => config.namespace;
    this.pathReplace = config.pathReplace || this.pathReplace;
    this.includeSettings = config.include;
  }

  get include() {
    let includeFile = 'handlebars';
    if (this.includeSettings.runtime || this.includeSettings.runtime == null) includeFile += '.runtime';
    if (this.includeSettings.amd) includeFile += '.amd';
    if (this.optimize) includeFile += '.min';
    includeFile += '.js';
    return [
      sysPath.join(__dirname, 'dist', includeFile),
      sysPath.join(__dirname, 'ns.js')
    ];
  }

  compile(params) {
    let data = params.data;
    const path = params.path;

    if (this.optimize) {
      data = data.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
      data = data.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
    }

    let result;
    try {
      const source = `Handlebars.template(${handlebars.precompile(data)})`;
      const ns = this.namespace(path);

      if (ns) {
        const key = ns + '.' + path.replace(/\\/g, '/').replace(this.pathReplace, '').replace(/\..+?$/, '').replace(/\//g, '.');
        result = `Handlebars.initNS( '${key}' ); ${key} = ${source}`;
      } else {
        result = umd(source);
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(result);
  }
}

HandlebarsCompiler.prototype.brunchPlugin = true;
HandlebarsCompiler.prototype.type = 'template';
HandlebarsCompiler.prototype.pattern = /\.(hbs|handlebars)$/;
HandlebarsCompiler.prototype.pathReplace = /^.*templates\//;

module.exports = HandlebarsCompiler;

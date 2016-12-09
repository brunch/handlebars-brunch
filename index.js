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

    const ns = config.namespace;
    this.namespace = typeof ns === 'function' ? ns : () => ns;
    this.pathReplace = config.pathReplace || /^.*templates\//;
    this.includeSettings = config.include || {};
  }

  get include() {
    let includeFile = 'handlebars';
    const include = this.includeSettings;
    if (include.runtime !== false) includeFile += '.runtime';
    if (include.amd) includeFile += '.amd';
    if (this.optimize) includeFile += '.min';
    includeFile += '.js';

    return [
      sysPath.join(__dirname, 'dist', includeFile),
      sysPath.join(__dirname, 'ns.js')
    ];
  }

  set paramsData(value) {
    if (this.optimize) {
      this._paramsData = value.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
      this._paramsData = value.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
    }
    this._paramsData = value;
  }

  get paramsData() {
    return this._paramsData;
  }

  get source() {
    return `Handlebars.template(${handlebars.precompile(this.paramsData)})`;
  }

  compile(params) {
    const path = params.path;
    this.paramsData = params.data;

    try {
      let result;
      const ns = this.namespace(path);

      if (ns) {
        const key = ns + '.' + path.replace(/\\/g, '/').replace(this.pathReplace, '').replace(/\..+?$/, '').replace(/\//g, '.');
        result = `Handlebars.initNS( '${key}' ); ${key} = ${this.source}`;
      } else {
        result = umd(this.source);
      }

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }

  }

  compileStatic(params) {
    this.paramsData = params.data;

    try {
      return Promise.resolve(this.source);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

HandlebarsCompiler.prototype.brunchPlugin = true;
HandlebarsCompiler.prototype.type = 'template';
HandlebarsCompiler.prototype.pattern = /\.(hbs|handlebars)$/;
HandlebarsCompiler.prototype.extension = 'hbs';
HandlebarsCompiler.prototype.staticTargetExtension = 'html';

module.exports = HandlebarsCompiler;

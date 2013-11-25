handlebars = require 'handlebars'
umd = require 'umd-wrapper'
sysPath = require 'path'

module.exports = class HandlebarsCompiler
  brunchPlugin: yes
  type: 'template'
  extension: 'hbs'
  pattern: /\.(?:hbs|handlebars)$/

  constructor: (@config) ->
    handlebarsConfig = @config.plugins?.handlebars
    if handlebarsConfig
      handlebarsConfig.overrides?(handlebars)
      @namespace = handlebarsConfig.namespace

  compile: (data, path, callback) ->
    try
      source = "Handlebars.template(#{handlebars.precompile data})"
      result = 
        if @namespace
          ns = @namespace
          key = path.replace(/^.*templates\//, '').replace(/\..+?$/, '')
          "if (typeof #{ns} === 'undefined'){ #{ns} = {} }; #{ns}['#{key}'] = #{source}"
        else
          umd source
    catch err
      error = err
    finally
      callback error, result

  include: [
    (sysPath.join __dirname, '..', 'vendor',
      'handlebars.runtime-1.0.js')
  ]

handlebars = require 'handlebars'
sysPath = require 'path'

module.exports = class HandlebarsCompiler
  brunchPlugin: yes
  type: 'template'
  extension: 'hbs'
  pattern: /\.(?:hbs|handlebars)$/

  constructor: (@config) ->
    null

  compile: (data, path, callback) ->
    try
      content = handlebars.precompile data
      result = "module.exports = Handlebars.template(#{content});"
    catch err
      error = err
    finally
      callback error, result

  include: [
    sysPath.join ([__dirname, '..']
      .concat require('../package').config.dist.split '/')...
  ]

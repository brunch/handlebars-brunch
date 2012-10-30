'use strict'

fs = require 'fs'
mkdirp = require 'mkdirp'
sysPath = require 'path'

config =
  get: (name) -> process.env["npm_package_config_#{name}"]
  dist: -> @get 'dist'
  deps: -> @get 'deps'
  dir: -> @get 'depsDir'
  strip: -> @get 'removeExports'

read = ->
  (for dep in config.deps().split /\s+/
    path = "#{__dirname}/../#{config.dir()}/#{dep}.js"
    (fs.readFileSync(path).toString()
      .match RegExp config.strip(), 'm')[1]
  ).join ''

write = (content) ->
  mkdirp (sysPath.dirname config.dist()), 0o755, (error) ->
    throw error if error?
    fs.writeFileSync config.dist(), content

module.exports = -> write read()

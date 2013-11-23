## handlebars-brunch
Adds [Handlebars](http://handlebarsjs.com/) support to
[brunch](http://brunch.io).

## Usage
Install the plugin via npm with `npm install --save handlebars-brunch`.

Or, do manual install:

* Add `"handlebars-brunch": "x.y.z"` to `package.json` of your brunch app.
  Pick a plugin version that corresponds to your minor (y) brunch version.
* If you want to use git version of plugin, add
`"handlebars-brunch": "git+https://github.com/brunch/handlebars-brunch.git"`.

### Brunch plugin settings
If customization is needed or desired, settings can be modified in your brunch
config file (such as `brunch-config.coffee`):

* __overrides__: _(Function)_ no default
    * This function will receive the `handlebars` object which you can use to override [Handlebar's public API](https://github.com/wycats/handlebars.js/blob/7f6ef1dd38794f12aee33c76c04f604a7651810b/lib/handlebars/compiler/javascript-compiler.js#L10)

**Example:**
```coffeescript
exports.config =
  ...
  plugins:
    handlebars:
      overrides: (handlebars) ->
        handlebars.JavaScriptCompiler::nameLookup = (parent, name, type) ->
          # Your custom nameLookup method.
```

## License

The MIT License (MIT)

Copyright (c) 2012-2013 Paul Miller (http://paulmillr.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

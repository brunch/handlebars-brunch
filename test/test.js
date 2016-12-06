'use strict';

const sysPath = require('path');
const Handlebars = require('handlebars');
const expect = require('chai').expect;
const Plugin = require('../index');
const config = require('./fixtures/brunch.conf');

global.Handlebars = Handlebars;
require('../ns');

describe('Plugin', () => {
  let plugin;

  beforeEach(() => {
    plugin = new Plugin({
      plugins: {}
    });
  });

  it('should be an object', () => {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', () => {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  describe('include runtime options', () => {

    it('should include runtime compiler', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.runtime.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.runtimeTrue);

      expect(plugin.include).to.be.deep.equal(expected);
    });

    it('should include full compiler', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.runtimeFalse);

      expect(plugin.include).to.be.deep.equal(expected);
    });

    it('should include full optimized compiler', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.min.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.runtimeFalseOptimizedTrue);

      expect(plugin.include).to.be.deep.equal(expected);
    });

    it('should include runtime compiler with amd', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.runtime.amd.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.runtimeTrueAmdTrue);

      expect(plugin.include).to.be.deep.equal(expected);
    });

    it('should include optimized runtime compiler', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.runtime.min.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.runtimeTrueOptimizeTrue);

      expect(plugin.include).to.be.deep.equal(expected);
    });

    it('should include optimized runtime compiler with amd', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.runtime.amd.min.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.runtimeTrueAmdTrueOptimizeTrue);

      expect(plugin.include).to.be.deep.equal(expected);
    });
  });

  describe('include amd options', () => {

    it('should include amd compiler', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.amd.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.amdTrue);

      expect(plugin.include).to.be.deep.equal(expected);
    });

    it('should include optimized amd compiler', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.amd.min.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.amdTrueOptimizeTrue);

      expect(plugin.include).to.be.deep.equal(expected);
    });

    it('should not include amd compiler', () => {
      const expected = [
        sysPath.join(process.cwd(), 'dist', 'handlebars.js'),
        sysPath.join(process.cwd(), 'ns.js')
      ];
      plugin = new Plugin(config.amdFalse);

      expect(plugin.include).to.be.deep.equal(expected);
    });
  });

  describe('global namespace as a string', () => {
    beforeEach(() => {
      plugin = new Plugin({
        plugins: {
          handlebars: {
            namespace: 'JST.Sub'
          }
        }
      });
    });

    it('should be object', done => {
      const content = '<p>{{a}}</p>';
      const expected = '<p>hello</p>';

      plugin.compile({data: content, path: 'templates/hello.hbs'}).then(data => {
        eval(data);
        console.log(JST.Sub['hello']({ a: 'hello'}));
        expect(JST.Sub['hello']({ a: 'hello'})).to.equal(expected);
        done();
      }, error => expect(error).not.to.be.ok);
    });
  });

  describe('global namespace as a function', () => {
    beforeEach(() => {
      plugin = new Plugin({
        plugins: {
          handlebars: {
            namespace: function (filePath) {
              return 'test_templates';
            }
          }
        }
      });
    });

    it('should be object', done => {
      const content = '<p>{{a}}</p>';
      const expected = '<p>hello</p>';

      plugin.compile({data: content, path: 'templates/hello'}).then(data => {
        eval(data);
        expect(test_templates['hello']({ a: 'hello'})).to.equal(expected);
        done();
      }, error => expect(error).not.to.be.ok);
    });
  });
});

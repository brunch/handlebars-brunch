'use strict';

const expect = require('chai').expect;
const Plugin = require('./');
const Handlebars = require('handlebars');

global.Handlebars = Handlebars;
require('./ns');

describe('Plugin', () => {
  let plugin;

  beforeEach(() => {
    plugin = new Plugin({});
  });

  it('should be an object', () => {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', () => {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', done => {
    const content = '<strong>{{weak}}</strong>';
    const expected = '<strong>wat</strong>';

    plugin.compile({data: content, path: 'template.handlebars'}).then(data => {
      expect(eval(data)({weak: 'wat'})).to.equal(expected);
      done();
    }, error => expect(error).not.to.be.ok);
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

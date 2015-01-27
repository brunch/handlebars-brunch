var expect = require('chai').expect;
var Plugin = require('./');
var Handlebars = require('handlebars');
global.Handlebars = Handlebars;
require('./ns');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', function(done) {
    var content = '<strong>{{weak}}</strong>';
    var expected = '<strong>wat</strong>';

    plugin.compile(content, 'template.handlebars', function(error, data) {
      expect(error).not.to.be.ok;
      expect(eval(data)({weak: 'wat'})).to.equal(expected);
      done();
    });
  });

  describe('global namespace as a string', function() {
    beforeEach(function() {
      plugin = new Plugin({
        plugins: {
          handlebars: {
            namespace: 'JST.Sub'
          }
        }
      });
    });

    it('should be object', function(done) {
      var content = '<p>{{a}}</p>';
      var expected = '<p>hello</p>';

      plugin.compile(content, 'templates/hello.hbs', function(error, data) {
        expect(error).not.to.be.ok;
        eval(data);
        expect(JST.Sub['hello']({ a: 'hello'})).to.equal(expected);
        done();
      });
    });
  });
  
  describe('global namespace as a function', function() {
    beforeEach(function() {
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

    it('should be object', function(done) {
      var content = '<p>{{a}}</p>';
      var expected = '<p>hello</p>';

      plugin.compile(content, 'templates/hello', function(error, data) {
        expect(error).not.to.be.ok;
        eval(data);
        expect(test_templates['hello']({ a: 'hello'})).to.equal(expected);
        done();
      });
    });
  });
});

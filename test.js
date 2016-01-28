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

    plugin.compile({data: content, path: 'template.handlebars'}).then(data => {
      expect(eval(data)({weak: 'wat'})).to.equal(expected);
      done();
    }, error => expect(error).not.to.be.ok);
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

      plugin.compile({data: content, path: 'templates/hello.hbs'}).then(data => {
        eval(data);
        expect(JST.Sub['hello']({ a: 'hello'})).to.equal(expected);
        done();
      }, error => expect(error).not.to.be.ok);
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

      plugin.compile({data: content, path: 'templates/hello'}).then(data => {
        eval(data);
        expect(test_templates['hello']({ a: 'hello'})).to.equal(expected);
        done();
      }, error => expect(error).not.to.be.ok);
    });
  });
});

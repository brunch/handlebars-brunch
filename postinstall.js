/**
 * Created by Paul on 10/11/2015.
 */

var sysPath = require('path');
var fs = require('fs');

fs.mkdir('./dist');

var runtime = ['', '.runtime'], amd = ['', '.amd'], min = ['', '.min'];

runtime.forEach(function(r) {
  amd.forEach(function(a) {
    min.forEach(function(m) {
      var fileName = 'handlebars' + r + a + m + '.js';
      var absFilePath = sysPath.join(sysPath.dirname( require.resolve('handlebars')), '..', 'dist', fileName);
      fs.symlinkSync(absFilePath, sysPath.join(__dirname, 'dist', fileName));
    });
  });
});


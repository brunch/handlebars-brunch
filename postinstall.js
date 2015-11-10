/**
 * Created by Paul on 10/11/2015.
 */

var sysPath = require('path');
var fs = require('fs');

fs.mkdir('./dist');

var runtime = ['', '.runtime'], amd = ['', '.amd'], min = ['', '.min'];

for(var i = 0; i < runtime.length; i++) {
  for(var j = 0; j < amd.length; j++) {
    for(var k = 0; k < min.length; k++) {
      var fileName = 'handlebars' + runtime[i] + amd[j] + min[k] + '.js';
      var absFilePath = sysPath.join(sysPath.dirname( require.resolve('handlebars')), '..', 'dist', fileName);
      fs.symlinkSync(absFilePath, sysPath.join(__dirname, 'dist', fileName));
    }
  }
}



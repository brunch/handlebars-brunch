/**
 * Created by papostol on 27/01/2015.
 */
(function(root) {

  root.windowReady = root.windowReady || function windowReady(fn) {
      if (root.document.readyState != 'loading'){
        fn();
      } else {
        root.document.addEventListener('DOMContentLoaded', fn);
      }
    };

  windowReady(function() {
    Handlebars.initNS = function (ns, obj) {
      var levels = ns.split('.'), first = levels.shift();
      obj = obj || root;
      obj[first] = obj[first] || {};
      if (levels.length) {
        Handlebars.initNS(levels.join('.'), obj[first]);
      }
      return obj[first];
    };
  });

})(typeof window !== "undefined" ? window : global);
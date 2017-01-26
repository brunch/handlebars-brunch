module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'app.js': /^app/
      }
    },
    templates: {
      joinTo: 'app.js'
    },
  },
  modules: {
    autoRequire: {
      'app.js': ['app']
    }
  }
};
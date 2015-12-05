
module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('nd-grunt');

  //load ndjs config file to ndjs.config
  var ndjs={initConfig:function(config){this.config=config;}};
  require(__dirname+'/ndfile')(ndjs);
  grunt.initConfig({
    nd_debug: {
      options:
      {
        ndoptions:ndjs.config.options,
        'console-port':8000,
        'node-inspector-port':8001,
        'debugger-port':8002,
        'backend-port':8003,
        'frontend-port':8004
      }
    },
    nd_compile: {
      options:
      {
        ndoptions:ndjs.config.options,
        buildDir: 'build',
        outFile:'out.exe'
      }
    }});

    grunt.registerTask('default', ['nd_debug']);

  };

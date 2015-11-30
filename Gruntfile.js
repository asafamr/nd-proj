/*jshint camelcase: false*/

module.exports = function (grunt) {
  'use strict';




	//console.log(require('path').dirname(require.main.filename));

  grunt.loadNpmTasks('nd-grunt');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-shell');

  //load ndjs config file to ndjs.config
  var ndjs={initConfig:function(config){this.config=config;}};
  require(__dirname+'/ndfile')(ndjs);

  grunt.initConfig({

			nd_grunt: {
				options:
				{
          ndjsConfig:ndjs.config.options,
					frontend:ndjs.config.options.frontend,
          backend:ndjs.config.options.backend,
          outgoing:ndjs.config.options.outgoing,
					buildDir: 'build',
					target: 'dist/ndout.exe'

				}
		},
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
},


    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/*',
            '<%= config.tmp %>/*'
          ]
        }]
      }

    },


    shell: {
        runNW: {
            command: 'node node_modules\\nw\\bin\\nw <%= nd_grunt.options.frontend %> /',
            options: {
                      //stderr: false,
                      execOptions: {

                      }
                  }
        },
			runNodeDebug: {
					command: 'node-debug main.js',
			options: {
                //stderr: false,
                execOptions: {
                    cwd: 'duck_modules'
                }
            }}

    },
		useminPrepare: {
      html: ['<%= nd_grunt.options.frontend %>/index.html'],
      options: {
        dest: '<%= nd_grunt.build_dir %>/'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= config.dist %>/public/{,*/}*.html'],
      css: ['<%= config.dist %>/public/{,*/}*.css'],
      js: ['<%= config.dist %>/public/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= config.dist %>/public',
          '<%= config.dist %>/public/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },
		// Automatically inject Bower components into the front end
    wiredep: {
			compile:
			{
				src: '<%=nd_grunt.options.frontend %>/index.html',
        ignorePath: '<%= nd_grunt.options.frontend %>/',
        exclude: [],
				fileTypes: {
        html: {
          replace: {
            js: 'bower_components/{{filePath}}'
          }
        }
      }
			},
      target: {
        src: '<%=nd_grunt.options.frontend  %>/index.html',
        ignorePath: '<%=nd_grunt.options.frontend %>/',
        exclude: []
      }
    },

		injector: {
      options: {

      },
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/app/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= nd_grunt.options.frontend %>/index.html': [
              ['{.tmp,<%= nd_grunt.options.frontend %>}/views/**/*.js',
               //'!{.tmp,<%= nd_grunt.options.frontend %>}/views/app.js',
               '!{.tmp,<%= nd_grunt.options.frontend %>}/views/**/*.spec.js',
               '!{.tmp,<%= nd_grunt.options.frontend %>}/views/**/*.mock.js']
            ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/app/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= nd_grunt.options.frontend %>/index.html': [
            '<%= nd_grunt.options.frontend %>/views/**/*.css'
          ]
        }
      }

    }

  }

									);



  grunt.registerTask('default', ['nd_debug']);





};

'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    build: 'build'
  };
  grunt.loadNpmTasks('grunt-newer');
  grunt.initConfig({
    coEdit: appConfig,
    watch: {
      express: {
        files:  [ 'server/**/*.js' ],
          tasks:  [ 'express' ],
          options: {
          livereload: true,
            spawn: false
        }
      },

      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },

      js: {
        files: ['<= coEdit.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: 35729
        }
      },

      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },

      styles: {
        files: ['<%= coEdit.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: 35729
        },
        files: [
          '<%= coEdit.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css'
        ]
      }
    },

    express: {
      options: {
        script: 'server/app.js',
          port: 3000
      },
      defaults: {}
    },
    open: {
      dev: {
        path: 'http://localhost:3000/'
      }
    },


    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= coEdit.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    clean: {
      build: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= coEdit.build %>/public/{,*/}*',
            '!<%= coEdit.build %>/public/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    wiredep: {
      app: {
        src: ['<%= coEdit.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      }
    },

    filerev: {
      build: {
        src: [
          '<%= coEdit.build %>/public/scripts/{,*/}*.js',
          '<%= coEdit.build %>/public/styles/{,*/}*.css',
          '<%= coEdit.build %>/public/styles/fonts/*'
        ]
      }
    },

    useminPrepare: {
      html: '<%= coEdit.app %>/index.html',
      options: {
        dest: '<%= coEdit.build %>/public',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              // css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['<%= coEdit.build %>/public/{,*/}*.html'],
      css: ['<%= coEdit.build %>/public/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= coEdit.build %>/public',
          '<%= coEdit.build %>/public/images',
          '<%= coEdit.build %>/public/styles'
        ]
      }
    },

    imagemin: {
      build: {
        files: [{
          expand: true,
          cwd: '<%= coEdit.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= coEdit.build %>/public/images'
        }]
      }
    },

    svgmin: {
      build: {
        files: [{
          expand: true,
          cwd: '<%= coEdit.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= coEdit.build %>/public/images'
        }]
      }
    },

    htmlmin: {
      build: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= coEdit.build %>/public',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= coEdit.build %>/public'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      build: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      build: {
        html: ['<%= coEdit.build %>/public/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: './server/',
          dest: '/server',
          src: '**/*.*'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= coEdit.app %>',
          dest: '<%= coEdit.build %>/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= coEdit.build %>/public/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/build',
          src: 'fonts/*',
          dest: '<%= coEdit.build %>/public'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= coEdit.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      build: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('dev', 'start dev server', function (target) {
    if (target === 'build') {
      return grunt.task.run('express:development');
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'express',
      'open',
      'watch'
    ]);
  });
  grunt.registerTask('serve', 'Compile then start a connect/express web server', function (target) {
    if (target === 'build') {
      return grunt.task.run(['build', 'express:prod']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'express',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'wiredep',
    'useminPrepare',
    'concurrent:build',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:build',
    'cdnify',
    // 'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);
  grunt.registerTask('test', [
    'newer:jshint',
    'test',
  ]);

  grunt.registerTask('default', [
    'serve'
  ]);
};

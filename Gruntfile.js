'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
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
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= coEdit.dist %>/public/{,*/}*',
            '!<%= coEdit.dist %>/public/.git{,*/}*'
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
      dist: {
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
      dist: {
        src: [
          '<%= coEdit.dist %>/public/scripts/{,*/}*.js',
          '<%= coEdit.dist %>/public/styles/{,*/}*.css',
          '<%= coEdit.dist %>/public/styles/fonts/*'
        ]
      }
    },

    useminPrepare: {
      html: '<%= coEdit.app %>/index.html',
      options: {
        dest: '<%= coEdit.dist %>/public',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['<%= coEdit.dist %>/public/{,*/}*.html'],
      css: ['<%= coEdit.dist %>/public/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= coEdit.dist %>/public',
          '<%= coEdit.dist %>/public/images',
          '<%= coEdit.dist %>/public/styles'
        ]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= coEdit.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= coEdit.dist %>/public/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= coEdit.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= coEdit.dist %>/public/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= coEdit.dist %>/public',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= coEdit.dist %>/public'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
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
      dist: {
        html: ['<%= coEdit.dist %>/public/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: './server/',
          dest: './dist/',
          src: '**/*.*'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= coEdit.app %>',
          dest: '<%= coEdit.dist %>/public',
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
          dest: '<%= coEdit.dist %>/public/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= coEdit.dist %>/public'
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
      dist: [
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
    if (target === 'dist') {
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
    if (target === 'dist') {
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
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);
  grunt.registerTask('test', [
    // 'newer:jshint',
    'test',
  ]);

  grunt.registerTask('default', [
    'serve'
  ]);
};
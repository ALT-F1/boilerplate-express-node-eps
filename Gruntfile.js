/**
 * Created with JetBrains WebStorm.
 * User: aboujraf
 * Date: 12/08/13
 * Time: 17:19
 * To change this template use File | Settings | File Templates.
 */

'use strict';

// Mount folder to connect.
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};


module.exports = function (grunt) {

    // Load all Grunt tasks

    require('matchdep').filterDev('*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
            appConfig: grunt.file.readJSON('./app/config/appConfig.json'),


            // Metadata.
            pkg: grunt.file.readJSON('package.json'),
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

            // Task configuration.

            // Clean folders before compile assets.
            clean: {
                dev: '<%= appConfig.app.dev %>',
                dist: '<%= appConfig.app.dist %>',
                html: '<%= appConfig.app.dev %>/**/*.html',
                options: {
                    force: true
                }
            },

            // Start local server.
            connect: {
                dev: {
                    options: {
                        port: '<%= appConfig.app.devPort %>',
                        hostname: 'localhost',
                        middleware: function (connect) {
                            return [
                                //livereloadSnippet,
                                mountFolder(connect, grunt.template.process('<%= appConfig.app.dev %>')),
                                mountFolder(connect, grunt.template.process('<%= appConfig.app.src %>'))
                            ];
                        }
                    }
                },

                dist: {
                    options: {
                        port: '<%= appConfig.app.distPort %>',
                        hostname: 'localhost',
                        middleware: function (connect) {
                            return [
                                mountFolder(connect, grunt.template.process('<%= appConfig.app.dist %>'))
                            ];
                        }
                    }
                }
            },

            // Copy files and folders.
            copy: {
                dev: {
                    files: [
                        {
                            cwd: '<%= appConfig.app.src %>',
                            dest: '<%= appConfig.app.dev %>',
                            expand: true,
                            src: [ '**/*' ]
                        }
                    ]
                },

                dist: {
                    files: [
                        {
                            cwd: '<%= appConfig.app.dev %>',
                            dest: '<%= appConfig.app.dist %>',
                            dot: true,
                            expand: true,
                            src: [
                                '**/*',
                                '!test/**',
                                '!**/lib/**',
                                '**/*.jade',
                                '!**/<%= appConfig.app.assets.templates %>/**',
                                '!**/<%= appConfig.app.assets.scripts %>/**',
                                '!**/<%= appConfig.app.assets.styles %>/**'
                            ]
                        }
                    ]
                }
            },


            // Compile Jade.
            jade: {
                dev: {
                    files: {
                        '<%= appConfig.app.dev %>/': '<%= appConfig.app.src %>/**/*.jade'
                    }
                },
                options: {
                    basePath: '<%= appConfig.app.src %>',
                    client: false,
                    compileDebug: false,
                    pretty: true
                }
            },

            jshint: {
                options: {
                    jshintrc: '.jshintrc'
                },
                gruntfile: {
                    src: 'Gruntfile.js'
                },
                app: {
                    src: ['<%= appConfig.app.src %>/<%= appConfig.directories..src %>/*.js', '<%= appConfig.app.src %>/routes/**/*.js']
                }
            },

            karma: {
                unit: {
                    configFile: 'karma.conf.js'
                }
            },

            markdown: {
                all: {
                    files: [
                        {
                            expand: true,
                            src: '*.MD',
                            dest: '_generated/docs/html/',
                            ext: '.html'
                        }
                    ]
                }
            },

            nodemon: {
                src: {
                    options: {
                        file: '<%= appConfig.app.src %>/<%= appConfig.app.rootPage %>',
                        args: ['development'],
                        nodeArgs: ['--debug'],
                        ignoredFiles: ['*.md', 'node_modules/**'],
                        watchedExtensions: ['js', 'jade', 'css'],
                        watchedFolders: ['<%= appConfig.app.src %>', '<%= appConfig.app.src %>/routes/**', '<%= appConfig.app.src %>/views/**'],
                        delayTime: 1,
                        env: {
                            PORT: '<%= appConfig.app.srcPort %>'
                        },
                        cwd: __dirname
                    }
                },
                dev: {
                    options: {
                        file: '<%= appConfig.app.dev %>/<%= appConfig.app.rootPage %>',
                        args: ['development'],
                        nodeArgs: ['--debug'],
                        ignoredFiles: ['*.md', 'node_modules/**'],
                        watchedExtensions: ['js', 'jade'],
                        watchedFolders: ['<%= appConfig.app.dev %>', '<%= appConfig.app.dev %>/routes/**', '<%= appConfig.app.dev %>/views/**'],
                        delayTime: 1,
                        env: {
                            PORT: '<%= appConfig.app.devPort %>'
                        },
                        cwd: __dirname
                    }
                },
                dist: {
                    options: {
                        file: '<%= appConfig.app.dist %>/<%= appConfig.app.rootPage %>',
                        args: ['production'],
                        nodeArgs: ['--debug'],
                        ignoredFiles: ['*.md', 'node_modules/**'],
                        watchedExtensions: ['js'],
                        watchedFolders: ['test', 'tasks'],
                        delayTime: 1,
                        env: {
                            PORT: '<%= appConfig.app.distPort %>'
                        },
                        cwd: __dirname
                    }
                }
            },

            // Open a web server with a given URL.

            // TODO: add distPort for the future
            open: {
                server: {
                    path: 'http://localhost:<%= appConfig.app.devPort %>'
                }
            },

            server: {
                port: '<%= appConfig.app.devPort %>',
                base: './'
            },

            watch: {
                //every time a file is changed, a task is performed
                gruntfile: {
                    files: ['<%= jshint.app.src %>', '<%= jshint.gruntfile.src %>'],
                    tasks: ['jshint:gruntfile', 'jshint:app' ]
                },
                app: {
                    files: '{<%= appConfig.app.dev %>,<%= appConfig.app.src %>}/**/*.{css,html,js,jpg,jpeg,png}',
                    options: {
                        livereload: '<%= appConfig.app.livereloadPort %>'
                    }
                },
                jade: {
                    files: '<%= appConfig.app.src %>/**/*.jade',
                    tasks: 'compile:jade',
                    options: {
                        livereload: '<%= appConfig.app.livereloadPort %>'
                    }
                }
            }
        }
    )
    ;

    // Compile assets.
    grunt.registerTask('compile', function (task) {

        if (task === undefined) {
            grunt.log.ok('Running all compilers.');

            return grunt.task.run([
                'compile:jade'
            ]);
        }

        var cleaner;

        switch (task) {
        case 'coffee':
            cleaner = 'clean:scripts';
            task = 'coffee:app';
            break;
        case 'coffeeTest':
            cleaner = 'clean:test';
            task = 'coffee:test';
            break;
        case 'compass':
            cleaner = 'clean:styles';
            break;
        case 'jade':
            cleaner = 'clean:html';
            break;
        }

        grunt.task.run([
            cleaner,
            task
        ]);
    });


    // Compress, concatenate, generate documentation and run unit tests.
    grunt.registerTask('build', function () {

        // Run all builder tasks.
        grunt.task.run([
            'clean:dist',
            //            'compile',
            'copy:dev',
            'copy:dist',
            'clean:dev'
        ]);

        // Passing the flag --preview, after the build a server will be started to
        // preview your build.
        if (grunt.option('preview')) {
            grunt.task.run('nodemon:dist');
            grunt.task.run([ 'open', 'connect:dist:keepalive' ]);
        }
    });

    // Start local server and watch for changes in files.
    grunt.registerTask('dev', ['jshint',
        'clean:dev',
        //        'compile',
        'copy:dev',
        'nodemon:dev'

    ]);

    grunt.registerTask('setupFiles', function () {

        var directories = grunt.file.readJSON('./app/config/appConfig.json').directories;

        console.log('default directories: ' + JSON.stringify(directories));

        /*
         grunt.file.mkdir('.' + directories.appDir + directories.publicDir);
         if (!grunt.file.exists(RPCMJSONfilelocation))
         {
         grunt.file.write(RPCMJSONfilelocation, '{}');
         console.log(RPCMJSONfilelocation + ' file is created');
         }
         */


    });

    // Start local server and watch for changes in files.
    grunt.registerTask('src', [
        'setupFiles',
        //'jshint',
        'nodemon:src'
    ]);

    // Available tasks
    grunt.registerTask('default', ['src']);

    //generate the documentation
    grunt.registerTask('doc', ['markdown']);


    grunt.registerTask('test', ['karma']);
}
;
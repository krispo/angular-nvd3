/* global module */

module.exports = function(grunt){

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner:
                        '/**************************************************************************\n' +
                        '* <%= pkg.title || pkg.name %>, ' +
                        'v<%= pkg.version %>; ' +
                        '<%= pkg.license %>\n' +
                        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                        '**************************************************************************/\n',
                stripBanners: true
            },

            dist: {
                src: ['src/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            min: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            afterconcat: ['dist/<%= pkg.name %>.js'],
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'jshint', 'uglify']);
};
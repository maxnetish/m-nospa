module.exports = function (grunt) {

    var buildDir = 'build';
    var nodeModulesDir = 'node_modules';
    var srcDir = 'src';
    var mainAppFile = 'server.js';
    var webpack = require('webpack');
    var webpackCommonOptions = require('./webpack.config.js');
    var path = require('path');

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: [
            buildDir
        ],

        copy: {
            // favicon: {
            //     files: [
            //         {
            //             expand: true,
            //             filter: 'isFile',
            //             flatten: true,
            //             src: srcDir + '/*.ico',
            //             dest: path.join(buildDir, 'pub')
            //         }
            //     ]
            // },
            'pug views': {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: srcDir + '/views',
                        src: ['**/*.pug'],
                        dest: buildDir + '/views'
                    }
                ]
            }
        },

        babel: {
            'back': {
                options: {
                    sourceMap: 'inline',
                    presets:
                        [
                            [
                                'env',
                                {
                                    'targets': {
                                        'node': 'current'
                                    }
                                }
                            ]
                        ]
                },
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: srcDir + '/back',
                        src: ['**/*.js'],
                        dest: buildDir + '/back'
                    }
                ]
            }
        },

        webpack: {
            options: webpackCommonOptions,
            front: {
                devtool: 'source-map'
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy', 'babel:back', 'webpack:front']);
};
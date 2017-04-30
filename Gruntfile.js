module.exports = function (grunt) {

    var buildDir = 'build';
    var nodeModulesDir = 'node_modules';
    var srcDir = 'src';
    var outputLess = 'assets/styles.css';
    var outputNormalize = 'assets/normalize.css';
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
            },
            'normalize css': {
                files: [{
                    src: path.join(nodeModulesDir, 'normalize.css/normalize.css'),
                    dest: path.join(buildDir, outputNormalize)
                }]
            },
            'images': {
                files: [
                    {
                        expand: true,
                        filter: 'isFile',
                        cwd: srcDir,
                        src: ['**/*.jpg', '**/*.png'],
                        dest: buildDir + '/assets'
                    }
                ]
            }
        },

        babel: {
            'back': {
                options: {
                    sourceMap: 'inline',
                    presets: [
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

        less: {
            dev: {
                files: [{
                    src: srcDir + '/front/**/*.less',
                    dest: path.join(buildDir, outputLess)
                }],
                options: {
                    sourceMap: true,
                    outputSourceFiles: true,
                    plugins: [
                        new (require('less-plugin-npm-import')),
                        new (require('less-plugin-autoprefix'))({
                            browsers: ['last 2 versions']
                        })
                    ]
                }
            },
            prod: {
                files: [{
                    src: srcDir + '/front/**/*.less',
                    dest: path.join(buildDir, outputLess)
                }],
                options: {
                    sourceMap: false,
                    plugins: [
                        new (require('less-plugin-npm-import')),
                        new (require('less-plugin-autoprefix'))({
                            browsers: ['last 2 versions']
                        })
                    ]
                }
            }
        },

        webpack: {
            options: webpackCommonOptions,
            front: {
                devtool: 'source-map'
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy', 'babel:back', 'less:dev', 'webpack:front']);
};
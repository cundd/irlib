module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        webpack: {
            default: require('./webpack.config.js')
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
                //background: true
            },
            ci: {
                configFile: 'karma.conf-ci.js'
                //background: true
            }
        },

        mochaTest: {
            unit: {
                options: {
                    //reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                    require: [
                        'chai',
                        'tests/bootstrap-common.js',
                        'tests/bootstrap-mocha-cli.js'
                    ]
                },
                src: ['tests/**/*-test.js']
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            jshintrc: true
        },

        watch: {
            files: ['<%= jshint.files %>', 'tests/**/*.js'],
            tasks: ['webpack', 'mochaTest']
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask('test', ['webpack', 'mochaTest', 'karma:unit']);
    grunt.registerTask('build', ['jshint', 'webpack']);
    grunt.registerTask('default', ['jshint', 'webpack', 'mochaTest']);

};
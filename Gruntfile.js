module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        shell: {
            neuterPlus: {
                command: 'neuter-plus -v --input includes.js --output ../<%= pkg.main %> --wrapBefore "" --wrapAfter ""',
                options: {
                    execOptions: {
                        cwd: 'src'
                    }
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
                //background: true
            }
        },

        mochaTest: {
            unit: {
                options: {
                    //reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/**/*.js']
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },

        watch: {
            files: ['<%= jshint.files %>', 'test/**/*.js'],
            tasks: ['jshint', 'shell', 'mochaTest']
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['jshint', 'shell', 'mochaTest']);

};
var fs = require('fs');

module.exports = function(config) {

    // Use ENV vars on Travis and sauce.json locally to get credentials
    if (!process.env.SAUCE_USERNAME) {
        if (!fs.existsSync('sauce.json')) {
            console.log('Create a sauce.json with your credentials based on the sauce-sample.json file.');
            process.exit(1);
        } else {
            process.env.SAUCE_USERNAME = require('./sauce').username;
            process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
        }
    }

    // Browsers to run on Sauce Labs
    var customLaunchers = {
        'Windows_10_InternetExplorer_latest': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 10'
        },
        'Windows_10_InternetExplorer_11': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11',
            platform: 'Windows 10'
        },
        'Windows_10_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 10'
        },
        'Windows_10_FireFox': {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 10'
        },

        'Windows_81_InternetExplorer_11': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11',
            platform: 'Windows 8.1'
        },
        'Windows_81_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 8.1'
        },
        'Windows_81_FireFox': {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 8.1'
        },

        'Windows_8_InternetExplorer_10': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10',
            platform: 'Windows 8'
        },
        'Windows_8_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 8'
        },
        'Windows_8_FireFox': {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 8'
        },

        'Windows_7_InternetExplorer_11': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11',
            platform: 'Windows 7'
        },
        'Windows_7_InternetExplorer_10': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10',
            platform: 'Windows 7'
        },
        'Windows_7_InternetExplorer_9': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '9',
            platform: 'Windows 7'
        },
        //'Windows_7_InternetExplorer_8': {
        //    base: 'SauceLabs',
        //    browserName: 'internet explorer',
        //    version: '8',
        //    platform: 'Windows 7'
        //},
        'Windows_7_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 7'
        },
        'Windows_7_FireFox': {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 7'
        },
        'Windows_7_Safari': {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'Windows 7'
        },

        //'Windows_XP_InternetExplorer_8': {
        //    base: 'SauceLabs',
        //    browserName: 'internet explorer',
        //    version: '8',
        //    platform: 'Windows XP'
        //},
        'Windows_XP_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows XP'
        },
        'Windows_XP_FireFox': {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows XP'
        },




        'iPhone_Simulator_9_Safari': {
            base: 'SauceLabs',
            browserName: 'iphone',
            version: '9.0',
            platform: 'OS X 10.10',
            deviceName: 'iPhone Simulator'
        },
        'iPad_Simulator_9_Safari': {
            base: 'SauceLabs',
            browserName: 'iphone',
            version: '9.0',
            platform: 'OS X 10.10',
            deviceName: 'iPad Simulator'

        },
        'iPhone_Simulator_8_4_Safari': {
            base: 'SauceLabs',
            browserName: 'iphone',
            version: '8.4',
            platform: 'OS X 10.10',
            deviceName: 'iPhone Simulator'
        },
        'iPad_Simulator_8_4_Safari': {
            base: 'SauceLabs',
            browserName: 'iphone',
            version: '8.4',
            platform: 'OS X 10.10',
            deviceName: 'iPad Simulator'

        },
        'iPhone_Simulator_7_1_Safari': {
            base: 'SauceLabs',
            browserName: 'iphone',
            version: '7.1',
            platform: 'OS X 10.9',
            deviceName: 'iPhone Simulator'
        },
        'iPad_Simulator_7_1_Safari': {
            base: 'SauceLabs',
            browserName: 'iphone',
            version: '7.1',
            platform: 'OS X 10.9',
            deviceName: 'iPad Simulator'

        }
    };

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],


        // list of files / patterns to load in the browser
        files: [
            {pattern: 'tests/bootstrap-common.js', included: true, watched: false},
            {pattern: 'tests/bootstrap-karma.js', included: true, watched: false},
            {pattern: 'node_modules/mocha-jsdom/index.js', included: false, watched: false},
            'dist/irlib.js',
            'tests/**/*-test.js'
        ],


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'saucelabs'],


        // web server port
        port: 9876,

        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,
        //logLevel: config.LOG_INFO,

        sauceLabs: {
            testName: 'irLib: Karma',
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
        },
        captureTimeout: 120000,
        customLaunchers: customLaunchers,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: Object.keys(customLaunchers),
        singleRun: true
    });
};
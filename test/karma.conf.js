/* global module */

module.exports = function(config) {
    'use strict';

    config.set({

        // The root path location that will be used to resolve all relative paths defined in files and exclude.
        // If the basePath configuration is a relative path then it will be resolved to the __dirname of the configuration file.
        basePath: '../',

        // List of files/patterns to load in the browser.
        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/d3/d3.min.js',
            'node_modules/nvd3/build/nv.d3.min.js',
            'src/**/*.js',
            'test/**/*Spec.js'
        ],

        // List of frameworks you want to use. Typically, you will set this to ['jasmine'], ['mocha'] or ['qunit']...
        frameworks: ['jasmine'],

        // Enable or disable watching files and executing the tests whenever one of these files changes.
        // CLI: --auto-watch, --no-auto-watch
        autoWatch: true, //default false

        // When Karma is watching the files for changes, it tries to batch multiple changes into a single run
        // so that the test runner doesn't try to start and restart running tests more than it should.
        // The configuration setting tells Karma how long to wait (in milliseconds)
        // after any changes have occurred before starting the test process again.
        autoWatchBatchDelay: 250, //default 250

        // A list of browsers to launch and capture. When Karma starts up, it will also start up each browser
        // which is placed within this setting. Once Karma is shut down, it will shut down these browsers as well.
        // You can capture any browser manually just by opening the browser and visiting the URL
        // where the Karma web server is listening (by default it is http://localhost:9876/).
        // CLI: --browsers Chrome,Firefox
        browsers: ['Chrome'],

        customLaunchers: {
            chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Preprocessor matches files before serving them to the browser.
        preprocessors: {
            '**/*.coffee': 'coffee',
            'src/*.js': ['coverage'] // source files, that you wanna generate coverage for
        }, //default {'**/*.coffee': 'coffee'}

        // A list of reporters to use. Values: ['progress', 'dots']
        // CLI: --reporters progress,growl
        reporters: ['progress', 'coverage'], //default ['progress']

        // Optionally, configure the reporter. Tell karma how you want the coverage results
        coverageReporter: {
            type : 'html',
            dir : 'coverage/' // where to store the report
        },

        // Continuous Integration mode.
        // If true, Karma will start and capture all configured browsers,
        // run tests and then exit with an exit code of 0 or 1 depending on whether all tests passed or any tests failed.
        // CLI: --single-run, no-single-run
        singleRun: false, //default false

        // Timeout for capturing a browser (in ms).
        // The captureTimeout value represents the maximum boot-up time allowed for a browser to start and connect to Karma.
        // If any browser does not get captured within the timeout, Karma will kill it and try to launch it again and,
        // after three attempts to capture it, Karma will give up.
        captureTimeout: 60000, //default 60000

        // Enable or disable colors in the output (reporters and logs).
        // CLI: --colors, --no-colors
        colors: true, //default true

        // List of files/patterns to exclude from loaded files.
        exclude: [], //default

        // Hostname to be used when capturing browsers.
        hostname: 'localhost', //default 'localhost'

        // Level of logging. Values: [config.LOG_DISABLE, config.LOG_ERROR, config.LOG_WARN, config.LOG_INFO, config.LOG_DEBUG]
        // CLI: --log-level debug
        logLevel: config.LOG_INFO, //default config.LOG_INFO

        // A list of log appenders to be used. See the documentation for log4js for more information.
        loggers: [{type: 'console'}], //default [{type: 'console'}]

        // List of plugins to load.
        // A plugin can be a string (in which case it will be required by Karma) or an inlined plugin - Object.
        // By default, Karma loads all siblink modules, that match karma-*.
        plugins: ['karma-*'], //default ['karma-*']

        // The port where the webserver will be listening.
        // CLI: --port 9876
        port: 9876, //default 9876

        // A map of path-proxy pairs.
        proxies: {}, //default {}

        // Whether or not karma or any browsers should raise an error when an inavlid SSL certificate is found.
        proxyValidateSSL: true,

        // Karma will report all the tests that are slower than given time limit (in ms).
        // This is disabled by default (since the default value is 0).
        reportSlowerThan: 0, //default 0

        // An array of allowed transport methods between the browser and testing server.
        // This configuration setting is handed off to socket.io (which manages the communication between browsers
        // and the testing server).
        transports: ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling'], // default ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling']

        // The base url, where Karma runs.
        // All the Karma's urls get prefixed with the urlRoot.
        // This is helpful when using proxies, as sometimes you might want to proxy a url that is already taken by Karma.
        urlRoot: '/' //default '/'
    });

    if (process.env.TRAVIS) {
        config.browsers = ['chrome_travis_ci'];
        config.singleRun = true;
    }
};

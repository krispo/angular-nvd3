'use strict';

var app = angular.module('mainApp', ['mainApp.controllers','ngRoute', 'json-tree', 'nvd3', 'gridster', 'ui.bootstrap'])

/**
 * Config -------------------------------------------------------------------------
 */
    .config(['$routeProvider', 'CHARTS', function($routeProvider, CHARTS) {
        $routeProvider.when('/', {templateUrl: 'pages/home.html', controller: 'mainCtrl'});
        $routeProvider.when('/quickstart', {templateUrl: 'pages/quickstart.html', controller: 'quickstartCtrl'});
        $routeProvider.when('/liveedit', {templateUrl: 'pages/liveedit.html', controller: 'mainCtrl'});
        $routeProvider.when('/feedback', {templateUrl: 'pages/feedback.html', controller: 'mainCtrl'});
        $routeProvider.when('/dashboard', {templateUrl: 'pages/gridster/dashboard.html', controller: 'dashboardCtrl'});

        angular.forEach(CHARTS, function(value, key){
            $routeProvider.when(value.path, {templateUrl: 'pages/liveedit.html', controller: key + 'Ctrl'});
        });

        $routeProvider.otherwise({redirectTo: '/'});
    }])

/**
 * Run -------------------------------------------------------------------------
 */
    .run(function($rootScope, $route, $location, CHARTS, CONSTANTS){

        $rootScope.$on('$viewContentLoaded', function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;

            // configure highlightjs
            setTimeout(function(){
                hljs.initHighlightingOnLoad();
                angular.element('pre code').each(function(i, e) {
                    hljs.highlightBlock(e);
                });
            }, 300);

            $rootScope.params['selectedChart'] = CHARTS[$route.current.$$route.originalPath.replace(/\//g, "")];
        });

        $rootScope.params = {
            route: $route,
            mode: 'basic', //basic, extended
            visible: true,
            disabled: false,
            charts: CHARTS,
            constants: CONSTANTS,
            url: window.location.hostname.indexOf(CONSTANTS.productionHostname) > -1 ? '/angular-nvd3' : ''
        };

        $rootScope.utils = {
            keys: function(obj){
                return Object.keys(obj);
            },

            selectChart: function(chart){
                $location.path(chart.path)
            },

            prettyPrint: function(json, prettify){
                return (prettify) ? JSON.stringify(json, undefined, 2) : json;
            },

            reload: function(){
              $route.reload();
            },


        };

        /* global events for all nvd3 directives */
        $rootScope.events = {
            'jt.onFunctionChanged': function(e, $scope){
                $scope.api.refresh();
            }
        };

        /* subscribe on json-tree enevt */
        $rootScope.$on('onFunctionChanged', function(e){
            setTimeout(function(){
                $rootScope.$broadcast('jt.onFunctionChanged'); // broadcast event that will be caught by nvd3 directive
            }, 50)
        });
    })

/**
 * Main Ctrl -------------------------------------------------------------------------
 */
    .controller('mainCtrl', function($scope, $location){
        $scope.isActive = function(viewLocation){
            if (viewLocation === '/liveedit') return (($location.path() !== '/quickstart') && ($location.path() !== '/') && ($location.path() !== '/feedback') && ($location.path() !== '/dashboard'));
            else return viewLocation === $location.path();
        };
    })

/**
 * Quick Start Ctrl -------------------------------------------------------------------------
 */
    .controller('quickstartCtrl', function($scope, DOCS){
        $scope.docs = DOCS();

        $(document).ready(function(){

            $('#sidebar').affix({
                offset: {
                    top: 240
                }
            });

            setTimeout(function(){
                $(document.body).scrollspy({
                    target: '#leftCol',
                    offset: $('.navbar').outerHeight(true) + 10
                });

                /* smooth scrolling sections */
                $('a[href*=#]:not([href=#])').click(function() {
                    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                        if (target.length) {
                            $('html,body').animate({
                                scrollTop: target.offset().top - 50
                            }, 1000);
                            return false;
                        }
                    }
                });
            }, 300);
        });
    })

/**
 * Constants -------------------------------------------------------------------------
 */
    .constant('CHARTS', {
        lineChart: { path: '/lineChart', title: 'Line Chart', plunker: 'http://plnkr.co/edit/lBKFld?p=preview' },
        cumulativeLineChart: { path: '/cumulativeLineChart', title: 'Cumulative Line Chart', plunker: 'http://plnkr.co/edit/iIxJT3?p=preview' },
        stackedAreaChart: { path: '/stackedAreaChart', title: 'Stacked Area Chart', plunker: 'http://plnkr.co/edit/CIGW0o?p=preview' },
        multiBarChart: { path: '/multiBarChart', title: 'MultiBar Chart', plunker: 'http://plnkr.co/edit/zGc5Wp?p=preview' },
        discreteBarChart: { path: '/discreteBarChart', title: 'DiscreteBar Chart', plunker: 'http://plnkr.co/edit/6t5bky?p=preview' },
        historicalBarChart: { path: '/historicalBarChart', title: 'HistoricalBar Chart', plunker: 'http://plnkr.co/edit/U1wWbe?p=preview' },
        multiBarHorizontalChart: { path: '/multiBarHorizontalChart', title: 'MultiBar Horizontal Chart', plunker: 'http://plnkr.co/edit/UZGxhp?p=preview' },
        pieChart: { path: '/pieChart', title: 'Pie Chart', plunker: 'http://plnkr.co/edit/vtKWU0?p=preview' },
        scatterChart: { path: '/scatterChart', title: 'Scatter Chart', plunker: 'http://plnkr.co/edit/6hjwSA?p=preview' },
        lineWithFocusChart: { path: '/lineWithFocusChart', title: 'Line with Focus Chart', plunker: 'http://plnkr.co/edit/sWONMb?p=preview' },
        //linePlusBarChart: { path: '/linePlusBarChart', title: 'Line + Bar Chart', plunker: 'http://plnkr.co/edit/UASCUL?p=preview' },
        scatterPlusLineChart: { path: '/scatterPlusLineChart', title: 'Scatter + Line Chart', plunker: 'http://plnkr.co/edit/2MjNgj?p=preview' },
        linePlusBarWithFocusChart: { path: '/linePlusBarWithFocusChart', title: 'Line + Bar with Focus Chart', plunker: 'http://plnkr.co/edit/f0QET0?p=preview' },
        donutChart: { path: '/donutChart', title: 'Donut Chart', plunker: 'http://plnkr.co/edit/jOoJik?p=preview' },
        bulletChart: { path: '/bulletChart', title: 'Bullet Chart', plunker: 'http://plnkr.co/edit/Mb1cWN?p=preview' },
        sparklinePlus: { path: '/sparklinePlus', title: 'SparkLine Chart', plunker: 'http://plnkr.co/edit/9ARpl6?p=preview' },
        parallelCoordinates: { path: '/parallelCoordinates', title: 'Parallel Coordinates', plunker: 'http://plnkr.co/edit/rCQhcL?p=preview' },
        multiChart: { path: '/multiChart', title: 'Multi Chart', plunker: 'http://plnkr.co/edit/zsNxBJ?p=preview' },
        //lineWithFisheyeChart: { path: '/lineWithFisheyeChart', title: 'Line with Fisheye Chart', plunker: 'http://plnkr.co/edit/YFruJE?p=preview' }
        candlestickBarChart: { path: '/candlestickBarChart', title: 'Candlestick Chart', plunker: 'http://plnkr.co/edit/5vQOj9?p=preview' },
        sunburstChart: { path: '/sunburstChart', title: 'Sunburst Chart', plunker: 'http://plnkr.co/edit/emCcNv?p=preview' },
        ohlcBarChart: { path: '/ohlcBarChart', title: 'OHLC Chart', plunker: 'http://plnkr.co/edit/nevaIQ?p=preview' },
        boxPlotChart: { path: '/boxPlotChart', title: 'Box Plot Chart', plunker: 'http://plnkr.co/edit/7VHjgy?p=preview' },
        forceDirectedGraph: { path: '/forceDirectedGraph', title: 'Force Directed Graph', plunker: 'http://plnkr.co/edit/NRAu0k?p=preview' }
    })

    .constant('CONSTANTS', {
        version: '1.0.9',
        productionHostname: 'krispo.github.io',
        otherCharts: [
            { name: "Real-time chart updating", url: "http://plnkr.co/edit/yKFROu?p=preview" },
            { name: "Events handling in Discrete Bar Chart", url: "http://plnkr.co/edit/ZvfBDk?p=preview"},
            { name: "Dynamic chart synchronization with Firebase", url: "http://plnkr.co/edit/VYzmqk?p=preview" },
            { name: "Selecting series in Cumulative Line Chart ", url: "http://plnkr.co/edit/ZLcS6M?p=preview" },
            { name: "Charts in grid layout with FreewallJS", url: "http://plnkr.co/edit/6CUXlr?p=preview" },
            { name: "Custom xAxis labels in Line+Bar+Focus chart", url: "http://plnkr.co/edit/QiBdW7?p=preview" },
            { name: "Time delay while updating chart data", url: "http://plnkr.co/edit/xi8c2h?p=preview" },
            { name: "Compile charts dynamically", url: "http://plnkr.co/edit/0XtT0f?p=preview" },
            { name: "Creating multiple charts inside ng-repeat", url: "http://plnkr.co/edit/qFa4UL?p=preview"},
            { name: "Stacked Multi Bar chart with random barColor", url: "http://plnkr.co/edit/TwKry8?p=preview"},
            { name: "Pie Chart with custom legend position and size", url: "http://embed.plnkr.co/TJqjjkHaD2S0VjsGmN3c/preview"},
            { name: "Updating with Large Data", url: "http://plnkr.co/edit/PqepCg"},
            { name: "Ionic Framework demo", url: "http://plnkr.co/edit/e3HZQN?p=preview"},
            { name: "Gridster dashboard demo", url: "http://plnkr.co/edit/jEQMch?p=preview"},
            { name: "Highlight points in Line Chart", url: "http://plnkr.co/edit/WfcVzs?p=preview"},
            { name: "Gradient colors on Pie Chart", url: "http://plnkr.co/edit/8ALkDb?p=preview"},
            { name: "Custom Tooltip", url: "http://plnkr.co/edit/gUf5Yx?p=preview"}
        ]
    })

    .constant('DOCS', function(){
        return [{
            id: 'doc_install',
            title: 'Install',
            url: './docs/install.html'
        },{
            id: 'doc_basic',
            title: 'Basic usage',
            url: './docs/basic.html'
        },{
            id: 'doc_examples',
            title: 'Examples',
            url: './docs/examples.html'
        },{
            id: -1,
            caption: 'Configure Directive Attributes'
        },{
            id: 'doc_attributes',
            title: 'Attributes',
            url: './docs/attributes.html'
        },{
            id: -1,
            caption: 'Customize Chart Options'
        },{
            id: 'doc_options',
            title: 'Options',
            url: './docs/options.html'
        },{
            id: 'doc_events',
            title: 'Events',
            url: './docs/events.html'
        },{
            id: 'doc_wrapper',
            title: 'Wrapper',
            url: './docs/wrapper.html'
        },{
            id: 'doc_zooming',
            title: 'Zooming',
            url: './docs/zooming.html'
        },{
            id: -1,
            caption: 'More'
        },{
            id: 'doc_useCases',
            title: 'Use Cases',
            url: './docs/useCases.html'
        }]
    })

'use strict';

var app = angular.module('mainApp', ['mainApp.controllers','ngRoute', 'json-tree', 'nvd3'])

/**
 * Config -------------------------------------------------------------------------
 */
    .config(['$routeProvider', 'CHARTS', function($routeProvider, CHARTS) {
        $routeProvider.when('/', {templateUrl: 'pages/home.html', controller: 'mainCtrl'});
        $routeProvider.when('/quickstart', {templateUrl: 'pages/quickstart.html', controller: 'quickstartCtrl'});
        $routeProvider.when('/liveedit', {templateUrl: 'pages/liveedit.html', controller: 'mainCtrl'});

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
            }, 200);

            $rootScope.params['selectedChart'] = CHARTS[$route.current.$$route.originalPath.replace(/\//g, "")];
        });

        $rootScope.params = {
            route: $route,
            charts: CHARTS,
            constants: CONSTANTS
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
            }
        };
    })

/**
 * Main Ctrl -------------------------------------------------------------------------
 */
    .controller('mainCtrl', function($scope, $location){
        $scope.isActive = function(viewLocation){
            if (viewLocation === '/liveedit') return (($location.path() !== '/quickstart') && ($location.path() !== '/'));
            else return viewLocation === $location.path();
        };
    })

/**
 * Quick Start Ctrl -------------------------------------------------------------------------
 */
    .controller('quickstartCtrl', function($scope, DOCS){
        $scope.docs = DOCS;

        $(document).ready(function(){

            $('#sidebar').affix({
                offset: {
                    top: 240
                }
            });

            var $body   = $(document.body);
            var navHeight = $('.navbar').outerHeight(true) + 10;

            setTimeout(function(){
                $body.scrollspy({
                    target: '#leftCol',
                    offset: navHeight
                });

                /* smooth scrolling sections */
                $('a[href*=#]:not([href=#])').click(function() {
                    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                        var target = $(this.hash);
                        console.log(target)
                        console.log(this.hash.slice(1))
                        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                        if (target.length) {
                            $('html,body').animate({
                                scrollTop: target.offset().top - 50
                            }, 1000);
                            return false;
                        }
                    }
                });
            }, 100);
        });
    })

/**
 * Constants -------------------------------------------------------------------------
 */
    .constant('CHARTS', {
        lineChart: { path: '/lineChart', title: 'Line Chart' },
        cumulativeLineChart: { path: '/cumulativeLineChart', title: 'Cumulative Line Chart' },
        stackedAreaChart: { path: '/stackedAreaChart', title: 'Stacked Area Chart' },
        multiBarChart: { path: '/multiBarChart', title: 'MultiBar Chart' },
        discreteBarChart: { path: '/discreteBarChart', title: 'DiscreteBar Chart' },
        historicalBarChart: { path: '/historicalBarChart', title: 'HistoricalBar Chart' },
        multiBarHorizontalChart: { path: '/multiBarHorizontalChart', title: 'MultiBar Horizontal Chart' },
        pieChart: { path: '/pieChart', title: 'Pie Chart' },
        scatterChart: { path: '/scatterChart', title: 'Scatter Chart' },
        lineWithFocusChart: { path: '/lineWithFocusChart', title: 'Line with Focus Chart' },
        linePlusBarChart: { path: '/linePlusBarChart', title: 'Line + Bar Chart' },
        scatterPlusLineChart: { path: '/scatterPlusLineChart', title: 'Scatter + Line Chart' },
        linePlusBarWithFocusChart: { path: '/linePlusBarWithFocusChart', title: 'Line + Bar with Focus Chart' },
        donutChart: { path: '/donutChart', title: 'Donut Chart' },
        bulletChart: { path: '/bulletChart', title: 'Bullet Chart' },
        sparklinePlus: { path: '/sparklinePlus', title: 'SparkLine Chart' },
        parallelCoordinates: { path: '/parallelCoordinates', title: 'Parallel Coordinates' },
        multiChart: { path: '/multiChart', title: 'Multi Chart' },
        lineWithFisheyeChart: { path: '/lineWithFisheyeChart', title: 'Line with Fisheye Chart' }
    })

    .constant('CONSTANTS', {
        version: '0.0.3'
    })

    .constant('DOCS',
        [{
            id: 'install',
            title: 'Install',
            url: './docs/install.html'
        },{
            id: 'basic',
            title: 'Basic usage',
            url: './docs/basic.html'
        },{
            id: 'example',
            title: 'Example',
            url: './docs/example.html'
        }]
    )

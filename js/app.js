'use strict';

var app = angular.module('mainApp', ['mainApp.controllers','ngRoute', 'json-tree', 'nvd3'])
    .config(['$routeProvider', 'CHARTS', function($routeProvider, CHARTS) {
        $routeProvider.when('/', {templateUrl: 'pages/home.html', controller: 'mainCtrl'});
        $routeProvider.when('/quickstart', {templateUrl: 'pages/quickstart.html', controller: 'mainCtrl'});
        $routeProvider.when('/liveedit', {templateUrl: 'pages/liveedit.html', controller: 'mainCtrl'});

        angular.forEach(CHARTS, function(value, key){
            $routeProvider.when(value.path, {templateUrl: 'pages/liveedit.html', controller: key + 'Ctrl'});
        });

        $routeProvider.otherwise({redirectTo: '/'});
    }])

    .run(function($rootScope, $route, $location, CHARTS){

        $rootScope.$on('$viewContentLoaded', function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;

            $rootScope.params['selectedChart'] = CHARTS[$route.current.$$route.originalPath.replace(/\//g, "")];
        });

        $rootScope.params = {
            route: $route,
            charts: CHARTS
        };

        $rootScope.utils = {
            keys: function(obj){
                return Object.keys(obj);
            },

            selectChart: function(chart){
                $location.path(chart.path)
            }
        }
    })

    .controller('mainCtrl', function($scope, $location){
        $scope.isActive = function(viewLocation){
            if (viewLocation === '/liveedit') return (($location.path() !== '/quickstart') && ($location.path() !== '/'));
            else return viewLocation === $location.path();
        };
    })

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

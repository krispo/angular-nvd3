'use strict';

var app = angular.module('mainApp', ['mainApp.controllers','ngRoute', 'json-tree', 'nvd3'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'pages/home.html', controller: 'mainCtrl'});
        $routeProvider.when('/quickstart', {templateUrl: 'pages/quickstart.html', controller: 'mainCtrl'});
        $routeProvider.when('/liveedit', {templateUrl: 'pages/liveedit.html', controller: 'mainCtrl'});

        $routeProvider.when('/lineChart', {templateUrl: 'pages/liveedit.html', controller: 'lineChartCtrl'});
        $routeProvider.when('/cumulativeLineChart', {templateUrl: 'pages/liveedit.html', controller: 'cumulativeLineChartCtrl'});
        $routeProvider.when('/stackedAreaChart', {templateUrl: 'pages/liveedit.html', controller: 'stackedAreaChartCtrl'});
        $routeProvider.when('/multiBarChart', {templateUrl: 'pages/liveedit.html', controller: 'multiBarChartCtrl'});
        $routeProvider.when('/discreteBarChart', {templateUrl: 'pages/liveedit.html', controller: 'discreteBarChartCtrl'});
        $routeProvider.when('/historicalBarChart', {templateUrl: 'pages/liveedit.html', controller: 'historicalBarChartCtrl'});
        $routeProvider.when('/multiBarHorizontalChart', {templateUrl: 'pages/liveedit.html', controller: 'multiBarHorizontalChartCtrl'});
        $routeProvider.when('/pieChart', {templateUrl: 'pages/liveedit.html', controller: 'pieChartCtrl'});
        $routeProvider.when('/scatterChart', {templateUrl: 'pages/liveedit.html', controller: 'scatterChartCtrl'});
        $routeProvider.when('/scatterPlusLineChart', {templateUrl: 'pages/liveedit.html', controller: 'scatterPlusLineChartCtrl'});
        $routeProvider.when('/linePlusBarChart', {templateUrl: 'pages/liveedit.html', controller: 'linePlusBarChartCtrl'});
        $routeProvider.when('/lineWithFocusChart', {templateUrl: 'pages/liveedit.html', controller: 'lineWithFocusChartCtrl'});
        $routeProvider.when('/bulletChart', {templateUrl: 'pages/liveedit.html', controller: 'bulletChartCtrl'});
        $routeProvider.when('/sparklinePlus', {templateUrl: 'pages/liveedit.html', controller: 'sparklinePlusCtrl'});
        $routeProvider.when('/linePlusBarWithFocusChart', {templateUrl: 'pages/liveedit.html', controller: 'linePlusBarWithFocusChartCtrl'});
        $routeProvider.when('/donutChart', {templateUrl: 'pages/liveedit.html', controller: 'donutChartCtrl'});
        $routeProvider.when('/parallelCoordinates', {templateUrl: 'pages/liveedit.html', controller: 'parallelCoordinatesCtrl'});
        $routeProvider.when('/multiChart', {templateUrl: 'pages/liveedit.html', controller: 'multiChartCtrl'});
        $routeProvider.when('/lineWithFisheyeChart', {templateUrl: 'pages/liveedit.html', controller: 'lineWithFisheyeChartCtrl'});


        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .controller('mainCtrl', function($scope, $location){
        $scope.isActive = function(viewLocation){
            return viewLocation === $location.path();
        };
    })
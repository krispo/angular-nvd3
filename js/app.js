'use strict';

var app = angular.module('mainApp', ['mainApp.controllers','ngRoute', 'json-tree', 'nvd3'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'pages/home.html', controller: 'mainCtrl'});
        $routeProvider.when('/quickstart', {templateUrl: 'pages/quickstart.html', controller: 'mainCtrl'});
        $routeProvider.when('/liveedit', {templateUrl: 'pages/liveedit.html', controller: 'mainCtrl'});

        $routeProvider.when('/lineChart', {templateUrl: 'pages/liveedit.html', controller: 'lineChartCtrl'});
        $routeProvider.when('/cumulativeLineChart', {templateUrl: 'pages/liveedit.html', controller: 'cumulativeLineChartCtrl'});

        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .controller('mainCtrl', function($scope, $location){
        $scope.isActive = function(viewLocation){
            return viewLocation === $location.path();
        };
    })
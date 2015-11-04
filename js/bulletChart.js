'use strict';

angular.module('mainApp.controllers')

    .controller('bulletChartCtrl', function($scope){

        $scope.options = {
            chart: {
                type: 'bulletChart',
                duration: 500
            }
        };

        $scope.data = {
            "title": "Revenue",
            "subtitle": "US$, in thousands",
            "ranges": [150,225,300],
            "measures": [220],
            "markers": [250]
        }
    })
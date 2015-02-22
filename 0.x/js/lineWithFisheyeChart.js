'use strict';

angular.module('mainApp.controllers')

    .controller('lineWithFisheyeChartCtrl', function($scope){
        $scope.options = {
            chart: {
                type: 'lineWithFisheyeChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 50
                },
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    },
                    axisLabelDistance: 35
                }
            }
        };

        $scope.data = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 500; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                cos.push({x: i, y: .5 * Math.cos(i/10 + 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                }
            ];
        };
    })
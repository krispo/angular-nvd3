/**************************************************************************
* AngularJS-nvD3, v0.0.2; MIT; 05/05/2014 03:19
* http://krispo.github.io/angular-nvd3
**************************************************************************/
(function(){

    'use strict';

    angular.module('nvd3', [])

        .directive('nvd3', [function(){
            return {
                restrict: 'AE',
                scope: {
                    data: '=',
                    options: '='
                },
                link: function(scope, element, attrs){
                    var chart, svg;

                    // Update chart after options have changed
                    function updateWithOptions(options){
                        // Clearing
                        clearElement();

                        // Initialize chart with specific type
                        chart = getChart(options.chart.type);

                        angular.forEach(chart, function(value, key){
                            if ([
                                'options',
                                'multibar',
                                'discretebar',
                                'pie',
                                'scatter',
                                'bullet',
                                'sparkline'
                            ].indexOf(key) >= 0);

                            else if (key === 'dispatch') configureEvents(chart[key], options.chart[key]);

                            else if ([
                                'lines',
                                'lines2',
                                'bars', // TODO: Fix bug in nvd3, nv.models.historicalBar - chart.interactive (false -> _)
                                'bars2',
                                'legend',
                                'distX',
                                'distY',
                                'xAxis',
                                'x2Axis',
                                'yAxis',
                                'y1Axis',
                                'y2Axis',
                                'y3Axis',
                                'y4Axis',
                                'interactiveLayer',
                                'controls'
                            ].indexOf(key) >= 0) configure(chart[key], options.chart[key]);

                            else if ( // need to fix bug in nvd3
                                (key ==='clipEdge' && options.chart.type === 'multiBarHorizontalChart')
                                    || (key === 'clipVoronoi' && options.chart.type === 'historicalBarChart')
                                    || (key === 'color' && options.chart.type === 'indentedTreeChart')
                                    || (key === 'defined' && (options.chart.type === 'historicalBarChart' || options.chart.type === 'cumulativeLineChart'))
                                    || (key === 'forceX' && (options.chart.type === 'multiBarChart' || options.chart.type === 'discreteBarChart' || options.chart.type === 'multiBarHorizontalChart'))
                                    || (key === 'interpolate' && options.chart.type === 'historicalBarChart')
                                    || (key === 'isArea' && options.chart.type === 'historicalBarChart')
                                    || (key === 'size' && options.chart.type === 'historicalBarChart')
                                    || (key === 'stacked' && options.chart.type === 'stackedAreaChart')
                                    || (key === 'values' && options.chart.type === 'pieChart')
                                    || (key === 'xScale' && options.chart.type === 'scatterChart')
                                    || (key === 'yScale' && options.chart.type === 'scatterChart')
                                    || (key === 'x' && options.chart.type === 'lineWithFocusChart')
                                    || (key === 'y' && options.chart.type === 'lineWithFocusChart')
                                );

                            else (options.chart[key] === undefined || options.chart[key] === null)
                                    ? options.chart[key] = value()
                                    : chart[key](options.chart[key]);
                        });

                        // Select the current element to add <svg> element and to render the chart in
                        svg = d3.select(element[0]).append('svg')
                            .attr('height', options.chart.height)
                            .attr('width', options.chart.width);

                        // Update with data
                        updateWithData(scope.data);

                        // Configure wrappers
                        configureWrapper('title');
                        configureWrapper('subtitle');
                        configureWrapper('caption');

                        // Configure styles
                        configureStyles();

                        nv.addGraph(function() {
                            // Update the chart when window resizes
                            nv.utils.windowResize(function() { chart.update(); });
                            return chart;
                        });
                    }

                    // Update chart after data have changed
                    function updateWithData(data){
                        if (data && svg) {
                            scope.options.chart['transitionDuration'] = +scope.options.chart['transitionDuration'] || 250;
                            svg.datum(data)
                                .transition().duration(scope.options.chart['transitionDuration'])
                                .call(chart);
                        }
                    }

                    // Fully clear directive element
                    function clearElement(){
                        element.parent().find('.title').remove();
                        element.parent().find('.subtitle').remove();
                        element.parent().find('.caption').remove();
                        element.empty();
                    }

                    // Initialize and return chart with specific type
                    function getChart(type){
                        switch (type){
                            case 'bulletChart': return nv.models.bulletChart();
                            case 'cumulativeLineChart': return nv.models.cumulativeLineChart();
                            case 'discreteBarChart': return nv.models.discreteBarChart();
                            case 'stackedAreaChart': return nv.models.stackedAreaChart();
                            case 'multiBarChart': return nv.models.multiBarChart();
                            case 'historicalBarChart': return nv.models.historicalBarChart();
                            case 'multiBarHorizontalChart': return nv.models.multiBarHorizontalChart();
                            case 'pieChart': return nv.models.pieChart();
                            case 'scatterChart': return nv.models.scatterChart();
                            case 'scatterPlusLineChart': return nv.models.scatterPlusLineChart();
                            case 'lineChart': return nv.models.lineChart();
                            case 'linePlusBarChart': return nv.models.linePlusBarChart();
                            case 'lineWithFocusChart': return nv.models.lineWithFocusChart();
                            case 'linePlusBarWithFocusChart': return nv.models.linePlusBarWithFocusChart();
                            case 'sparklinePlus': return nv.models.sparklinePlus();
                            case 'indentedTreeChart': return nv.models.indentedTree();
                        }
                    }

                    // Configure the chart model with the passed options
                    function configure(chart, options){
                        if (chart){
                            if (options === undefined) options = {};
                            angular.forEach(chart, function(value, key){
                                if (key === 'dispatch') configureEvents(value, options[key]);
                                else if ([
                                    'scatter',
                                    'defined',
                                    'options',
                                    'axis',
                                    'rangeBand',
                                    'rangeBands'
                                ].indexOf(key) < 0)
                                    (options[key] === undefined || options[key] === null)
                                        ? options[key] = value()
                                        : chart[key](options[key]);
                            });
                        }
                    }

                    // Subscribe on the chart events (contained in 'dispatch')
                    // and pass eventHandler functions in the 'options' parameter
                    function configureEvents(dispatch, options){
                        if (dispatch){
                            if (options === undefined) options = {};
                            angular.forEach(dispatch, function(value, key){
                                (options[key] === undefined || options[key] === null)
                                    ? options[key] = value.on
                                    : dispatch.on(key + '._', options[key]);
                            });
                        }
                    }

                    // Configure 'title', 'subtitle', 'caption'.
                    // nvd3 has no sufficient models for it yet.
                    function configureWrapper(name){
                        scope.options[name] = scope.options[name] || {};

                        angular.forEach(defaultWrapper(name), function(value, key){
                            if (scope.options[name][key] === undefined || scope.options[name][key] === null) scope.options[name][key] = value;
                        });

                        var wrapElement = angular
                            .element('<div></div>')
                            .addClass(name).addClass(scope.options[name].class)
                            .removeAttr('style')
                            .css(scope.options[name].css)
                            .text(scope.options[name].text);

                        if (scope.options[name].enable) {
                            if (name === 'title') element.parent().prepend(wrapElement);
                            else if (name === 'subtitle') element.parent().find('.title').after(wrapElement);
                            else if (name === 'caption') element.parent().append(wrapElement);
                        }
                    }

                    // Add some styles to the whole directive element
                    function configureStyles(){
                        scope.options['styles'] = scope.options['styles'] || {};

                        angular.forEach(defaultStyles(), function(value, key){
                            if (scope.options['styles'][key] === undefined || scope.options['styles'][key] === null) scope.options['styles'][key] = value;
                        });

                        angular.forEach(scope.options['styles'].classes, function(value, key){
                            value ? element.addClass(key) : element.removeClass(key);
                        });

                        element.removeAttr('style').css(scope.options['styles'].css);
                    }

                    // Default values for 'title', 'subtitle', 'caption'
                    function defaultWrapper(_){
                        switch (_){
                            case 'title': return {
                                enable: false,
                                text: 'Write Your Title',
                                class: 'h4',
                                css: {
                                    width: scope.options.chart.width + 'px',
                                    textAlign: 'center'
                                }
                            };
                            case 'subtitle': return {
                                enable: false,
                                text: 'Write Your Subtitle',
                                css: {
                                    width: scope.options.chart.width + 'px',
                                    textAlign: 'center'
                                }
                            };
                            case 'caption': return {
                                enable: false,
                                text: 'Figure 1. Write Your Caption text.',
                                css: {
                                    width: scope.options.chart.width + 'px',
                                    textAlign: 'center'
                                }
                            };
                        }
                    }

                    // Default values for styles
                    function defaultStyles(){
                        return {
                            classes: {
                                'with-3d-shadow': true,
                                'with-transitions': true,
                                'gallery': false
                            },
                            css: {}
                        };
                    }

                    // Watching on options and data changing
                    scope.$watch('options', function(options){ updateWithOptions(options); }, true);
                    scope.$watch('data', function(data){ updateWithData(data); }, true);
                }
            };
        }]);
})();
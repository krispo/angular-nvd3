(function(){

    'use strict';

    angular.module('nvd3', [])

        .directive('nvd3', ['utils', function(utils){
            return {
                restrict: 'AE',
                scope: {
                    data: '=',      //chart data, [required]
                    options: '=',   //chart options, according to nvd3 core api, [required]
                    api: '=?',      //directive global api, [optional]
                    events: '=?',   //global events that directive would subscribe to, [optional]
                    config: '=?'    //global directive configuration, [optional]
                },
                link: function(scope, element, attrs){
                    var defaultConfig = {
                        extended: false,
                        visible: true,
                        disabled: false,
                        autorefresh: true,
                        refreshDataOnly: false,
                        deepWatchData: true,
                        debounce: 10 // default 10ms, time silence to prevent refresh while multiple options changes at a time
                    };

                    //basic directive configuration
                    scope._config = angular.extend(defaultConfig, scope.config);

                    //directive global api
                    scope.api = {
                        // Fully refresh directive
                        refresh: function(){
                            scope.api.updateWithOptions(scope.options);
                        },

                        // Update chart layout (for example if container is resized)
                        update: function() {
                            scope.chart.update();
                        },

                        // Update chart with new options
                        updateWithOptions: function(options){
                            // Clearing
                            scope.api.clearElement();

                            // Exit if options are not yet bound
                            if (angular.isDefined(options) === false) return;

                            // Exit if chart is hidden
                            if (!scope._config.visible) return;

                            // Initialize chart with specific type
                            scope.chart = nv.models[options.chart.type]();

                            // Generate random chart ID
                            scope.chart.id = Math.random().toString(36).substr(2, 15);

                            angular.forEach(scope.chart, function(value, key){
                                if ([
                                    'options',
                                    '_options',
                                    '_inherited',
                                    '_d3options',
                                    'state',
                                    'id',
                                    'resizeHandler'
                                ].indexOf(key) >= 0);

                                else if (key === 'dispatch') {
                                    if (options.chart[key] === undefined || options.chart[key] === null) {
                                        if (scope._config.extended) options.chart[key] = {};
                                    }
                                    configureEvents(scope.chart[key], options.chart[key]);
                                }

                                else if ([
                                    'lines',
                                    'lines1',
                                    'lines2',
                                    'bars',
                                    'bars1',
                                    'bars2',
                                    'stack1',
                                    'stack2',
                                    'stacked',
                                    'multibar',
                                    'discretebar',
                                    'pie',
                                    'scatter',
                                    'bullet',
                                    'sparkline',
                                    'legend',
                                    'distX',
                                    'distY',
                                    'xAxis',
                                    'x2Axis',
                                    'yAxis',
                                    'yAxis1',
                                    'yAxis2',
                                    'y1Axis',
                                    'y2Axis',
                                    'y3Axis',
                                    'y4Axis',
                                    'interactiveLayer',
                                    'controls'
                                ].indexOf(key) >= 0){
                                    if (options.chart[key] === undefined || options.chart[key] === null) {
                                        if (scope._config.extended) options.chart[key] = {};
                                    }
                                    configure(scope.chart[key], options.chart[key], options.chart.type);
                                }

                                //TODO: need to fix bug in nvd3
                                else if ((key === 'xTickFormat' || key === 'yTickFormat') && options.chart.type === 'lineWithFocusChart');

                                else if (options.chart[key] === undefined || options.chart[key] === null){
                                    if (scope._config.extended) options.chart[key] = value();
                                }

                                else scope.chart[key](options.chart[key]);
                            });

                            // Update with data
                            scope.api.updateWithData(scope.data);

                            // Configure wrappers
                            if (options['title'] || scope._config.extended) configureWrapper('title');
                            if (options['subtitle'] || scope._config.extended) configureWrapper('subtitle');
                            if (options['caption'] || scope._config.extended) configureWrapper('caption');


                            // Configure styles
                            if (options['styles'] || scope._config.extended) configureStyles();

                            nv.addGraph(function() {
                                // Update the chart when window resizes
                                if (scope.chart !== null && scope.chart !== undefined) {
                                    scope.chart.resizeHandler = nv.utils.windowResize(function() {
                                        scope.chart.update();
                                    });
                                    return scope.chart;
                                }
                            }, options.chart['callback']);
                        },

                        // Update chart with new data
                        updateWithData: function (data){
                            if (data) {
                                scope.options.chart['transitionDuration'] = +scope.options.chart['transitionDuration'] || 250;
                                // remove whole svg element with old data
                                d3.select(element[0]).select('svg').remove();

                                // Select the current element to add <svg> element and to render the chart in
                                d3.select(element[0]).append('svg')
                                    .attr('height', scope.options.chart.height)
                                    .attr('width', scope.options.chart.width  || '100%')
                                    .datum(data)
                                    .transition().duration(scope.options.chart['transitionDuration'])
                                    .call(scope.chart);
                            }
                        },

                        // Fully clear directive element
                        clearElement: function (){
                            element.find('.title').remove();
                            element.find('.subtitle').remove();
                            element.find('.caption').remove();
                            element.empty();
                            if (scope.chart!== null && scope.chart!== undefined ) {
                                // clear window resize event handler
                                if (scope.chart.resizeHandler) scope.chart.resizeHandler.clear();

                                // remove chart from nv.graph list
                                for (var i = 0; i < nv.graphs.length; i++) {
                                  if (nv.graphs[i]!==null && nv.graphs[i]!==undefined && nv.graphs[i].id === scope.chart.id) {
                                        nv.graphs.splice(i, 1);
                                  }
                                }
                            }
                            scope.chart = null;
                            nv.tooltip.cleanup();
                        },

                        // Get full directive scope
                        getScope: function(){ return scope; }
                    };

                    // Configure the chart model with the passed options
                    function configure(chart, options, chartType){
                        if (chart && options){
                            angular.forEach(chart, function(value, key){
                                if (key === 'dispatch') {
                                    if (options[key] === undefined || options[key] === null) {
                                        if (scope._config.extended) options[key] = {};
                                    }
                                    configureEvents(value, options[key]);
                                }
                                else if ([
                                    'scatter',
                                    'defined',
                                    'options',
                                    'axis',
                                    'rangeBand',
                                    'rangeBands',
                                    '_options',
                                    '_inherited',
                                    '_d3options',
                                    '_calls'
                                ].indexOf(key) < 0){
                                    if (options[key] === undefined || options[key] === null){
                                        if (scope._config.extended) options[key] = value();
                                    }
                                    else chart[key](options[key]);
                                }
                            });
                        }
                    }

                    // Subscribe to the chart events (contained in 'dispatch')
                    // and pass eventHandler functions in the 'options' parameter
                    function configureEvents(dispatch, options){
                        if (dispatch && options){
                            angular.forEach(dispatch, function(value, key){
                                if (options[key] === undefined || options[key] === null){
                                    if (scope._config.extended) options[key] = value.on;
                                }
                                else dispatch.on(key + '._', options[key]);
                            });
                        }
                    }

                    // Configure 'title', 'subtitle', 'caption'.
                    // nvd3 has no sufficient models for it yet.
                    function configureWrapper(name){
                        var _ = utils.deepExtend(defaultWrapper(name), scope.options[name] || {});

                        if (scope._config.extended) scope.options[name] = _;

                        var wrapElement = angular.element('<div></div>').html(_['html'] || '')
                            .addClass(name).addClass(_.class)
                            .removeAttr('style')
                            .css(_.css);

                        if (!_['html']) wrapElement.text(_.text);

                        if (_.enable) {
                            if (name === 'title') element.prepend(wrapElement);
                            else if (name === 'subtitle') element.find('.title').after(wrapElement);
                            else if (name === 'caption') element.append(wrapElement);
                        }
                    }

                    // Add some styles to the whole directive element
                    function configureStyles(){
                        var _ = utils.deepExtend(defaultStyles(), scope.options['styles'] || {});

                        if (scope._config.extended) scope.options['styles'] = _;

                        angular.forEach(_.classes, function(value, key){
                            value ? element.addClass(key) : element.removeClass(key);
                        });

                        element.removeAttr('style').css(_.css);
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

                    /* Event Handling */
                    // Watching on options changing
                    scope.$watch('options', utils.debounce(function(newOptions){
                        if (!scope._config.disabled && scope._config.autorefresh) scope.api.refresh();
                    }, scope._config.debounce, true), true);

                    // Watching on data changing
                    scope.$watch('data', function(newData, oldData){
                        if (newData !== oldData && scope.chart){
                            if (!scope._config.disabled && scope._config.autorefresh) {
                                scope._config.refreshDataOnly ? scope.chart.update() : scope.api.refresh(); // if wanted to refresh data only, use chart.update method, otherwise use full refresh.
                            }
                        }
                    }, scope._config.deepWatchData);

                    // Watching on config changing
                    scope.$watch('config', function(newConfig, oldConfig){
                        if (newConfig !== oldConfig){
                            scope._config = angular.extend(defaultConfig, newConfig);
                            scope.api.refresh();
                        }
                    }, true);

                    //subscribe on global events
                    angular.forEach(scope.events, function(eventHandler, event){
                        scope.$on(event, function(e){
                            return eventHandler(e, scope);
                        });
                    });

                    // remove completely when directive is destroyed
                    element.on('$destroy', function () {
                        scope.api.clearElement();
                    });
                }
            };
        }])

        .factory('utils', function(){
            return {
                debounce: function(func, wait, immediate) {
                    var timeout;
                    return function() {
                        var context = this, args = arguments;
                        var later = function() {
                            timeout = null;
                            if (!immediate) func.apply(context, args);
                        };
                        var callNow = immediate && !timeout;
                        clearTimeout(timeout);
                        timeout = setTimeout(later, wait);
                        if (callNow) func.apply(context, args);
                    };
                },
                deepExtend: function(dst){
                    var me = this;
                    angular.forEach(arguments, function(obj) {
                        if (obj !== dst) {
                            angular.forEach(obj, function(value, key) {
                                if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                                    me.deepExtend(dst[key], value);
                                } else {
                                    dst[key] = value;
                                }
                            });
                        }
                    });
                    return dst;
                }
            };
        });
})();
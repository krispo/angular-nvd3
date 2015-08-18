/*global jasmine, beforeEach, afterEach, describe, it, inject, expect, module */

describe('angular-nvd3 directive', function() {
    'use strict';

    var $compile, $scope;

    // Load the nvd3 module, which contains the directive
    beforeEach(module('nvd3'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $scope = _$rootScope_;
    }));

    afterEach(function(){
        $scope.$destroy();
    });

    function compileTpl(options, data){
        // Chart options & data
        $scope.options = options;
        $scope.data = data;

        // Compile a piece of HTML containing the directive
        var $element = $compile('<nvd3 options="options" data="data"></nvd3>')($scope);

        // fire all the watches, so the any scope expression in directive will be evaluated
        //$scope.$digest();

        return $element;
    }

    it('should load test', function() {
        expect(1).toBe(1);
    });

    describe('directive with options and data defined', function(){
        var chartOptions = {
            chart: {
                type: 'lineChart',
                height: 400,
                width: 500
            }
        };
        var data = {
            values: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}],
            key: 'Line Chart',
            color: '#ff7f0e'
        };

        it('parent scope options SHOULD MATCH directive scope options', function() {
            var element = compileTpl(chartOptions, data);
            expect(element.scope().options.chart).toEqual(jasmine.objectContaining({
                type: 'lineChart'
            }));
            expect(element.scope().options.chart).not.toEqual(jasmine.objectContaining({
                width: 1000
            }));
        });
        it('parent scope data SHOULD MATCH directive scope data', function() {
            var element = compileTpl(chartOptions, data);
            expect(element.scope().data.values.length).toBe(3);
            expect(element.scope().data).toEqual(jasmine.objectContaining({
                key: 'Line Chart'
            }));
        });
    });
});
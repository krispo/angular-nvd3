/**************************************************************************
* AngularJS-nvD3, v0.0.1; MIT; 04/30/2014 18:53
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
                    /* Body */
                }
            };
        }]);
})();
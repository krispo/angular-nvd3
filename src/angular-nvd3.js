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
            }
        }])
})()
(function(){

    'use strict';

    angular.module('json-tree', [])

        .directive('jsonTree', ['$compile', function($compile){
            return {
                restrict: 'EA',
                scope: {
                    json: '=',
                    node: '=?',
                    childs: '=?',
                    editLevel: '@',
                    collapsedLevel: '@'
                },
                controller: function($scope){

                    /* initialize container for child nodes */
                    $scope.childs = {};

                    /* define auxiliary functions */
                    $scope.utils = {

                        /* prettify json view */
                        wrap: {
                            start: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return '[';
                                    case 'object': return '{';
                                    default: return '';
                                };
                            },
                            middle: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return '...';
                                    case 'object': return '...';
                                    default: return '';
                                };
                            },
                            end: function(node){
                                if (node === undefined || node === null) return '';
                                switch (node.type()){
                                    case 'array': return ']';
                                    case 'object': return '}';
                                    default: return '';
                                };
                            },
                            isLastIndex: function(node, index){
                                if (node === undefined || node === null) return true
                                else return index >= node.length();
                            }
                        },

                        /* collapse/expand node by clicking */
                        clickNode: function(node){
                            node.isCollapsed = !node.isCollapsed;
                        },

                        /* add new node to the collection */
                        addNode: function(key, value){
                            var json = null;
                            try { json = JSON.parse(value); } catch (e){}

                            /* add element to the object */
                            if ($scope.node.type() === 'object') {
                                if (json !== null){
                                    $scope.json[key] = json
                                } else {
                                    $scope.json[key] = value
                                }

                            }
                            /* add element(s) to the array */
                            else if ($scope.node.type() === 'array') {
                                if (json !== null) {
                                    if (json.constructor === Array){
                                        /* push new array elements to the array */
                                        $scope.json.push.apply($scope.json, json);
                                    } else {
                                        /* push single element to the array */
                                        $scope.json.push(json);
                                    }
                                } else {
                                    $scope.json.push(value);
                                }
                            };
                            $scope.refresh();
                        },

                        /* reset node value by key to default == null */
                        resetNode: function(key){
                            $scope.json[key] = null;
                            $scope.refresh();
                        },

                        /* remove node by key from json */
                        removeNode: function(key){
                            if ($scope.node.type() === 'object')
                                delete $scope.json[key]
                            else if ($scope.node.type() === 'array')
                                $scope.json.splice(key, 1);
                            $scope.refresh();
                        },

                        /* validate text if input to the form */
                        validateNode: function(key){
                            /* check if null or "" */
                            if (!$scope.json[key]) $scope.json[key] = null;

                            /* try to convert string to number */
                            else if (!isNaN(+$scope.json[key]) && isFinite($scope.json[key]))
                                $scope.json[key] = +$scope.json[key];

                            /* try to parse string to json */
                            else {
                                if ($scope.node.isHighEditLevel){ /* if high editable level */
                                    try {
                                        var json = JSON.parse($scope.json[key]);
                                        $scope.json[key] = json;
                                        $scope.refresh();
                                    } catch (e){}
                                } else { /* if low editable level */
                                    /* check if boolean input -> then refresh */
                                    if ($scope.json[key] === "true" || $scope.json[key] === "false") {
                                        $scope.json[key] = JSON.parse($scope.json[key]);
                                        $scope.refresh();
                                    }
                                }
                            }
                        },

                        /* move node from position with index 'i' to position with index 'j' */
                        moveNode: function(i, j){
                            /* moving for object */
                            if ($scope.node.type() === 'object'){
                                var json = {},
                                    keys = Object.keys($scope.json),
                                    key1 = keys[i],
                                    key2 = keys[j];

                                angular.forEach($scope.json, function(value, key){
                                    if (key == key2) {
                                        if (j > i){
                                            json[key2] = $scope.json[key2];
                                            json[key1] = $scope.json[key1];
                                        } else {
                                            json[key1] = $scope.json[key1];
                                            json[key2] = $scope.json[key2];
                                        }
                                    }
                                    else if (key != key1) json[key] = value;
                                });
                                $scope.json = json;
                            }

                            /* moving for array */
                            else if ($scope.node.type() === 'array'){
                                var temp = $scope.json[i];
                                $scope.json.splice(i, 1);
                                $scope.json.splice(j, 0, temp);
                                $scope.refresh();
                            }
                        },

                        /* to skip ordering in ng-repeat */
                        keys: function(obj){
                            return (obj instanceof Object) ? Object.keys(obj) : [];
                        },

                        /* get type for variable val */
                        getType: function(val){
                            if (val === null) return 'null'
                            else if (val === undefined) return 'undefined'
                            else if (val.constructor === Array) return 'array'
                            else if (val.constructor === Object) return 'object'
                            else if (val.constructor === String) return 'string'
                            else if (val.constructor === Number) return 'number'
                            else if (val.constructor === Boolean) return 'boolean'
                            else if (val.constructor === Function) return 'function'
                            else return 'object'
                        }
                    };

                    /* define properties of the current node */
                    $scope.node = {

                        /* check node is collapsed */
                        isCollapsed: ($scope.collapsedLevel && +$scope.collapsedLevel) ? (+$scope.collapsedLevel <= 0) : true, /* set up isCollapsed properties, by default - true */

                        /* check editing level is high */
                        isHighEditLevel: $scope.editLevel !== "low",

                        /* if childs[key] is dragging now, dragChildKey matches to key  */
                        dragChildKey: null,

                        /* used to get info such as coordinates (top, left, height, width, meanY) of draggable elements by key */
                        dragElements: {},

                        /* check current node is object or array */
                        isObject: function(){
                            return angular.isObject($scope.json)
                        },

                        /* get type for current node */
                        type: function(){
                            return $scope.utils.getType($scope.json);
                        },

                        /* calculate collection length for object or array */
                        length: function(){
                            return ($scope.json instanceof Object) ? (Object.keys($scope.json).length) : 1
                        },

                        /* refresh template view */
                        refresh: function(){
                            $scope.refresh();
                        }
                    };
                },
                link: function(scope, element, attrs){

                    /* define child scope and template */
                    var childScope = scope.$new(),
                        template =
                        '<span ng-bind="utils.wrap.start(node)"></span>' +
                        '<span ng-bind="node.isCollapsed ? utils.wrap.middle(node) : \'&nbsp;&nbsp;&nbsp;\'" ng-click="utils.clickNode(node)"></span>' +
                        '<ul ng-hide="node.isCollapsed">' +
                            '<li ng-repeat="key in utils.keys(json) track by key">' +
                                '<div draggable>' +
                                    '<span  class="key" ng-click="utils.clickNode(childs[key])" >{{ key }}: </span>' +
                                    '<span ng-hide="childs[key].isObject()">' +
                                        '<input ng-show="childs[key].type() === \'boolean\'" type="checkbox" ng-model="json[key]"/>' +
                                        '<input type="text" ng-model="json[key]" ng-change="utils.validateNode(key)" ng-disabled="childs[key].type() === \'function\'" placeholder="null"/>' +
                                    '</span>' +
                                    '<json-tree json="json[key]" edit-level="{{editLevel}}" collapsed-level="{{+collapsedLevel - 1}}" node="childs[key]" ng-show="childs[key].isObject()"></json-tree>' +
                                    '<span class="reset" ng-dblclick="utils.resetNode(key)" ng-show="node.isHighEditLevel"> ~ </span>' +
                                    '<span class="remove" ng-dblclick="utils.removeNode(key)" ng-show="node.isHighEditLevel">-</span>' +
                                    '<span class="comma" ng-hide="utils.wrap.isLastIndex(node, $index + 1)">,</span>' +
                                '</div>' +
                            '</li>' +
                        '</ul>' +
                        '<span ng-bind="utils.wrap.end(node)"></span>' +
                        '<span class="add" ng-show="node.isHighEditLevel && node.isObject()" ng-click="addTpl = !addTpl; inputKey = null; inputValue = null"> + </span>' +
                        '<span ng-show="(addTpl && node.isHighEditLevel) || false">' +
                            '<span ng-show="node.type() === \'object\'"><input type="text" ng-model="inputKey" placeholder="key"/>: <input type="text" ng-model="inputValue" placeholder="value"/></span>' +
                            '<span ng-show="node.type() === \'array\'"><input type="text" ng-model="inputValue" placeholder="value"/></span>' +
                            '<button ng-click="utils.addNode(inputKey, inputValue); addTpl = false">+</button><button ng-click="addTpl = false">c</button>' +
                        '</span>';

                    /* define build template function */
                    scope.build = function(_scope){
                        if (scope.node.isObject()){
                            element.html('').append($compile(template)(_scope));
                        }
                    };

                    /* define refresh function */
                    scope.refresh = function(){
                        childScope.$destroy();
                        childScope = scope.$new();
                        scope.build(childScope);
                    };

                    /* build template view */
                    scope.build(childScope);
                }
            }
        }])

        .directive('draggable', function($document) {
            return {
                link: function(scope, element, attr) {
                    var startX, startY, deltaX, deltaY, emptyElement, keys, index;

                    /* Save information of the current draggable element to the parent json-tree scope.
                     * This would be done under initialization */
                    scope.node.dragElements[scope.key] = function(){
                        return element;
                    }

                    element.on('mousedown', function(event) {
                        /* Check if pressed Ctrl */
                        if (event.ctrlKey) {

                            scope.node.dragChildKey = scope.key; // tell parent scope what child element is draggable now

                            var rect = getRectangle(scope.node.dragElements[scope.key]()[0]);

                            /* If child element is not draggable, than make the current element draggable */
                            if (scope.childs[scope.key].dragChildKey == null) {
                                // Prevent default dragging of selected content
                                event.preventDefault();

                                startX = rect.left;
                                startY = rect.top;
                                deltaX = event.pageX - startX;
                                deltaY = event.pageY - startY;

                                /* Draggable element should have 'absolute' position style parameter */
                                element.addClass('drag');
                                element.css({
                                    width: rect.width + 'px'
                                });
                                setPosition(startX, startY);

                                /* Add an empty element to fill the hole */
                                emptyElement = angular.element("<div class='empty'></div>");
                                emptyElement.css({
                                    height: (rect.height - 2) + 'px',
                                    width: (rect.width - 2) + 'px'
                                });
                                element.after(emptyElement);

                                /* Auxiliary array of json keys to retain the order of the current key's positions */
                                keys = Object.keys(scope.json);
                                index = scope.$index;

                                /* Subscribe on document mouse events */
                                $document.on('mousemove', mousemoveEventHandler);
                                $document.on('mouseup', mouseupEventHandler);
                            }
                        }
                    });

                    element.on('mouseup', function(event){
                        /* tell parent scope that the current element with his children are now not draggable */
                        scope.node.dragChildKey = null;
                    })

                    function mousemoveEventHandler(event) {
                        var rect = getRectangle(scope.node.dragElements[scope.key]()[0]),
                            meanBefore, meanAfter;

                        if (index >= keys.length - 1) meanAfter = Infinity;
                        else meanAfter = getRectangle(scope.node.dragElements[keys[index + 1]]()[0]).meanY;

                        if (index <= 0) meanBefore = -Infinity;
                        else meanBefore = getRectangle(scope.node.dragElements[keys[index - 1]]()[0]).meanY;

                        /* Check the criterion for swapping two sibling nodes */
                        if (rect.top + rect.height > meanAfter + 1) {
                            swapKeys(index, index + 1);
                            scope.node.dragElements[keys[index]]().parent().append(emptyElement);
                            index += 1;
                        }
                        else if (rect.top < meanBefore - 1){
                            swapKeys(index, index - 1);
                            scope.node.dragElements[keys[index]]().parent().prepend(emptyElement);
                            index -= 1;
                        }

                        setPosition(startX, event.pageY - deltaY)
                    }

                    function mouseupEventHandler() {
                        /* Fix position and update json and tree view */
                        scope.utils.moveNode(scope.$index, index);
                        scope.$apply();

                        element.removeClass('drag');
                        setPosition(startX, startY);

                        emptyElement.remove();

                        $document.unbind('mousemove', mousemoveEventHandler);
                        $document.unbind('mouseup', mouseupEventHandler);
                    }

                    function setPosition(x, y){
                        element.css({
                            top: y + 'px',
                            left: x + 'px'
                        });
                    }

                    function swapKeys(i, j){
                        var key = keys[i];
                        keys[i] = keys[j];
                        keys[j] = key;
                    }

                    /* Get coordinates of rectangle region for the element 'el' */
                    function getRectangle(el){
                        var box = el.getBoundingClientRect(),
                            top = Math.round(box.top + window.pageYOffset),
                            left = Math.round(box.left + window.pageXOffset),
                            height = typeof el.offsetHeight === 'undefined' ? 0 : el.offsetHeight,
                            width = typeof el.offsetWidth === 'undefined' ? 0 : el.offsetWidth;

                        return { top: top, left: left, height: height, width: width, meanY: top + height / 2}
                    };
                }
            }
        });
})()
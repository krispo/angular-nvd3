# Fully editable JSON tree

An AngularJS directive used for displaying and editing JSON data in a tree view. It works independently of jQuery (only internal angular's jqLite).
Available operations with nodes:

* `add` new nodes,
* `reset` node values to null,
* `remove` node completely,
* `change` node value,
* `convert` type of the node (to object, array, string, number, boolean, null, function) implicitly,
* `drag` and `sort` tree nodes (via pressed `Ctrl`).

## How to use

### Install

Install it via bower:

    $ bower install json-tree

An AngularJS would be installed as a dependency automatically. If it won't, install it manually:

    $ bower install angular

Add dependencies to the `<head>` section of your main html:
```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/json-tree/json-tree.js"></script>
<link rel="stylesheet" href="bower_components/json-tree/json-tree.css">
```

If you don't use bower, you can manually download and unpack json-tree ([zip](https://github.com/krispo/json-tree/archive/v0.1.1.zip), [tar.gz](https://github.com/krispo/json-tree/archive/v0.1.1.tar.gz)).

### Basic usage

Inject `json-tree` directive into angular module and push some data to the controller:
```javascript
angular.module('myApp', ['json-tree'])
       .controller('myCtrl', function('$scope'){
           $scope.jsonData = { /* JSON data */ };
        })
```

and in html again you can use it like:
```html
<div ng-app='myApp'>
    <div ng-controller='myCtrl'>
        <json-tree json='jsonData'></json-tree>
    </div>
</div>
```

By default, it is used a **high** edit level that allows you to add new nodes,
reset node values to null, completely remove node, change value and type of the node (to object, array, string, number, boolean, function, null),
drag and sort tree nodes.

If you want to operate only with key-values of the nodes and to avoid transformation of json tree, you can add **low** `edit-level` attribute like:
```html
<json-tree json='jsonData' edit-level='low'></json-tree>
```

You can also customize initial depth of tree view by adding `collapsed-level` attribute like, that takes a numeric value:
```html
<json-tree json='jsonData' collapsed-level='2'></json-tree>
```
If `collapsed-level` <= 0, then json-tree is fully collapsed. If `collapsed-level` == 1, then the first level node would be uncollapsed.
If == 2 - the first and second level nodes. And so on.

You can completely refresh directive by using directive internal refresh function. To access this function just add `node` attribute like:
```html
<json-tree json='jsonData' node='nodeOptions'></json-tree>
```
and then use it in controller as:
```javascript
$scope.nodeOptions.refresh();
```

Drag and sort your tree nodes via pressed `Ctrl` key.

Add more style to prettify the view. See complete example in `example.html` file.

### Custom template

The default template can be overridden by new custom template as follows:
```js
angular.module('myApp', ['json-tree'])

.controller('myCtrl', ['$scope', 'jsonTreeConfig', function($scope, jsonTreeConfig){
    jsonTreeConfig.templateUrl = 'custom-template.html';
}]);
```

---
For more details of technically usage, please, watch example [online](http://krispo.github.io/json-tree) and test it.
There is given a short instruction.

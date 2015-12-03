# Angular-nvD3

[![Build Status](https://travis-ci.org/krispo/angular-nvd3.svg?branch=master)](https://travis-ci.org/krispo/angular-nvd3)
[![NPM Version](http://img.shields.io/npm/v/angular-nvd3.svg?style=flat)](https://www.npmjs.org/package/angular-nvd3)

This thing is designed to make it easier to work with [nvd3.js](https://github.com/novus/nvd3) re-usable charting library. This directive allows you to easily customize your charts via JSON API.

The key feature is that the original hierarchical structure of nvd3 models is completely preserved in directive JSON structure. This means that while you creating a complex chart that containing multiple elementary chart models (such as `line`, `bar`, `axis`, ...), you can in turn customize the properties of each internal elementary models as well as the global charting properties the way you want. This can be done as usual, but it becomes quite easily to customize while applying JSON approach to. 

Try it [online](http://krispo.github.io/angular-nvd3/).

## How to use

### Install

##### cdnjs

    https://cdnjs.cloudflare.com/ajax/libs/angular-nvd3/1.0.4/angular-nvd3.min.js

##### bower

    $ bower install angular-nvd3
    
An [angular.js](https://angularjs.org/), [D3.js](http://d3js.org/) and [nvd3.js](http://nvd3.org/) would be installed as a dependency automatically. If it won't for some reason, install it manually:
    
    $ bower install angular
    $ bower install d3
    $ bower install nvd3

Add dependencies to the `<head>` section of your main html:
```html
<meta charset="utf-8">  <!-- it's important for d3.js -->
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/d3/d3.js"></script>
<script src="bower_components/nvd3/build/nv.d3.js"></script> <!-- or use another assembly -->
<script src="bower_components/angular-nvd3/dist/angular-nvd3.js"></script>
<link rel="stylesheet" href="bower_components/nvd3/build/nv.d3.css">
```

##### npm

    $ npm install angular-nvd3

##### download

If you don't use bower or npm, you can manually download and unpack directive with the latest version ([zip](https://github.com/krispo/angular-nvd3/archive/v1.0.5.zip), [tar.gz](https://github.com/krispo/angular-nvd3/archive/v1.0.5.tar.gz)).

### Basic usage

Inject `nvd3` directive into angular module, set up some chart options and push some data to the controller:
```javascript
angular.module('myApp', ['nvd3'])
       .controller('myCtrl', function('$scope'){
           $scope.options = { /* JSON data */ };
           $scope.data = { /* JSON data */ }
        })
```

and in html again you can use it like:
```html
<div ng-app='myApp'>
    <div ng-controller='myCtrl'>
        <nvd3 options='options' data='data'></nvd3>
    </div>
</div>
```

The chart would be displayed on the page.

### Example

Let's create a simple **Discrete Bar Chart**.

Configure options:
```javascript
$scope.options = {
    chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 55
        },
        x: function(d){ return d.label; },
        y: function(d){ return d.value; },
        showValues: true,
        valueFormat: function(d){
            return d3.format(',.4f')(d);
        },
        transitionDuration: 500,
        xAxis: {
            axisLabel: 'X Axis'
        },
        yAxis: {
            axisLabel: 'Y Axis',
            axisLabelDistance: 30
        }
    }
};
```

Push some data:
```javascript
$scope.data = [{
    key: "Cumulative Return",
    values: [
        { "label" : "A" , "value" : -29.765957771107 },
        { "label" : "B" , "value" : 0 },
        { "label" : "C" , "value" : 32.807804682612 },
        { "label" : "D" , "value" : 196.45946739256 },
        { "label" : "E" , "value" : 0.19434030906893 },
        { "label" : "F" , "value" : -98.079782601442 },
        { "label" : "G" , "value" : -13.925743130903 },
        { "label" : "H" , "value" : -5.1387322875705 }
    ]
}];
```

See the [result](http://krispo.github.io/angular-nvd3/#/discreteBarChart).

Read more [docs](http://krispo.github.io/angular-nvd3/#/quickstart).

### Contribute

Test it using command:

    $npm test

Then build using [grunt](http://gruntjs.com/) (*node.js must be installed*):

    $grunt

## Release Notes

### [1.0.5 (current, nvd3 v1.8.1)](https://github.com/krispo/angular-nvd3/releases/tag/v1.0.5)
* fixed `index.js`
* fixed `onReady` attribute
* added `getElement` api method

### 1.0.4
* `deepWatchData = true` by default
* deleted `autorefresh`, `deepWatchConfig` configs
* added `deepWatchDataDepth = 2` config to specify watch depth level for data: 0 - by reference (cheap), 1 - by collection item (the middle), 2 - by value (expensive)
* added `onReady` attribute
* added `updateWithTimeout`, `refreshWithTimeout` methods to `api`
* fixed bugs

### 1.0.3
* Fixed width and height issues for IE: [#16](https://github.com/krispo/angular-nvd3/issues/16), [#158](https://github.com/krispo/angular-nvd3/issues/158), [#200](https://github.com/krispo/angular-nvd3/issues/200), [#226](https://github.com/krispo/angular-nvd3/issues/226).
* Fixed tooltip issue [#172](https://github.com/krispo/angular-nvd3/issues/172)
* Set `refreshDataOnly = true` by default
* Added `zoom & pan` functionality
* Fixed tooltip content, subtitle and many other issues...

### 1.0.2
* Fixed `tooltip` [#222](https://github.com/krispo/angular-nvd3/pull/222) for interactive guideline.
* Set `deepWatchData` to `false` by default
* Added `deepWatchOptions` and `deepWatchConfig` properties

### 1.0.1
* Add support for `Candlestick Chart`, `OHLC Chart`, `Sunburst Chart`, `Pox Plot Chart`

### 1.0.0-rc.2
* Add support of nvd3 1.8.1
* Fix [issue](https://github.com/krispo/angular-nvd3/issues/100) with `stacked` parameter

### 1.0.0-rc
* Rename `utils` module to avoid conflicts
* Fix nvd3 version reference in bower.json
* Remove usage of reserved word `class`
* Fix multiple resize event listeners which were causing null pointer exceptions
* Change bower.json's main property to use regular instead of minified file

### 1.0.0-beta (nvd3 v1.7.1)
Under developing in **master** (1.x) branch

--

> If you use the old nvd3 version (v1.1.15-beta), I recommend you to use an updated assembly (`nv.d3.js` and `nv.d3.css`, you can find it in the `lib` directory of this project) with some fixes rather than the last one installed via bower.

### [0.1.1 (stable for nvd3 v1.1.15-beta)](https://github.com/krispo/angular-nvd3/releases/tag/v0.1.1)
Under developing in **0.x** branch

### 0.1.0
* added update method to global api, [pull request](https://github.com/krispo/angular-nvd3/pull/27)
* fixed bug for `multiChart`
* added getScope method to global api. (give an access to internal directive scope, for example, we can get chart object like: `$scope.api.getScope().chart`)
* fixed multiple chart rendering under initializing (fixed multiple callback calls)

### 0.0.9
...

## License
Licensed under the terms of the [MIT License](https://github.com/krispo/angular-nvd3/blob/master/LICENSE)

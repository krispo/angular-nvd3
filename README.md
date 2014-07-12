# Angular-nvD3

This thing is designed to make it easier to work with [nvd3.js](https://github.com/novus/nvd3) re-usable charting library. This directive allows you to easily customize your charts via JSON API.

The key feature is that the original hierarchical structure of nvd3 models is completely preserved in directive JSON structure. This means that while you creating a complex chart that containing multiple elementary chart models (such as `line`, `bar`, `axis`, ...), you can in turn customize the properties of each internal elementary models as well as the global charting properties the way you want. This can be done as usual, but it becomes quite easily to customize while applying JSON approach to. 

Try it [online](http://krispo.github.io/angular-nvd3/).

## How to use

### Install

Install it via bower:

    $ bower install angular-nvd3
    
An [angular.js](https://angularjs.org/), [D3.js](http://d3js.org/) and [nvd3.js](http://nvd3.org/) would be installed as a dependency automatically. If it won't for some reason, install it manually:
    
    $ bower install angular
    $ bower install d3
    $ bower install nvd3

> I advise you to use a newer nvd3 assembly rather than the last one installed via bower. A more recent and fixed assembly `nv.d3.js` and `nv.d3.css` you can find in the `lib` directory of this project. Also you can make your own assembly according to nvd3 docs. 

Add dependencies to the `<head>` section of your main html:
```html
<meta charset="utf-8">  <!-- it's important for d3.js -->
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/d3/d3.js"></script>
<script src="bower_components/nvd3/nv.d3.js"></script> <!-- or use another assembly -->
<script src="bower_components/angular-nvd3/dist/angular-nvd3.js"></script>
<link rel="stylesheet" href="bower_components/nvd3/nv.d3.css">
```

If you don't use bower, you can manually download and unpack directive ([zip](https://github.com/krispo/angular-nvd3/archive/v0.0.3.zip), [tar.gz](https://github.com/krispo/angular-nvd3/archive/v0.0.3.tar.gz)).

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

## License
Licensed under the terms of the [MIT License](https://github.com/krispo/angular-nvd3/blob/master/LICENSE)

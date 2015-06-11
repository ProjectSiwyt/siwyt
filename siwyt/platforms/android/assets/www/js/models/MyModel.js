/*
This form will use Function.prototype.toString() to find the require() calls, 
and add them to the dependency array, along with "require", 
so the code will work correctly with relative paths.

EQUIVALENTE A

define(["require", "backbone"], function(require) {
    var mod = require("backbone");
});

utilizzo "backbone" in quanto nel file main.js ho 

require.config({
	paths:{
		backbone: "../lib/backbone/backbone"
	}
});
*/
define(function(require) {

	var Backbone = require("backbone");

	var MyModel = Backbone.Model.extend({
		constructorName: "MyModel"
	});

	return MyModel;
});
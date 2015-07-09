define(function(require) {

	var Backbone = require("backbone");
	var Postit = require("models/Postit");

	var Postits = Backbone.Collection.extend({
		constructorName: "Postits",
		model: Postit
	});

	return Postits;
});
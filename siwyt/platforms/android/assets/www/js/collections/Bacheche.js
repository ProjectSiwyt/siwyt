define(function(require) {

	var Backbone = require("backbone");
	var Bacheca = require("models/Bacheca");

	var Bacheche = Backbone.Collection.extend({
		constructorName: "Bacheche",
		model: Bacheca
	});

	return Bacheche;
});
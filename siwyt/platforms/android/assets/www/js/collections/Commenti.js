define(function(require) {

	var Backbone = require("backbone");
	var Commento = require("models/Commento");

	var Commenti = Backbone.Collection.extend({
		constructorName: "Commenti",
		model: Commento,
	});

	return Commenti;
});
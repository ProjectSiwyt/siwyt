define(function(require) {

	var Backbone = require("backbone");

	var Bacheca = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			nome: "Not specified",
		},
		constructorName: "Bacheca"
	});

	return Bacheca;
});

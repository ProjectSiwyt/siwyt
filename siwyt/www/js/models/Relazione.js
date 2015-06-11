define(function(require) {

	var Backbone = require("backbone");

	var Relazione = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			etichetta: ""
		},
		constructorName: "Relazione"
	});

	return Relazione;
});

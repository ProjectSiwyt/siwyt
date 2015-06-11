define(function(require) {

	var Backbone = require("backbone");

	var Responsabile = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			nome: "Not specified",
			cognome: "Not specified",
			mail: "Not specified",
			username: "Not specified",
			password: "Not specified",
			confermato: false
		},
		constructorName: "Responsabile"
	});

	return Responsabile;
});

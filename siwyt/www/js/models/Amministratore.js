define(function(require) {

	var Backbone = require("backbone");

	var Amministratore = Backbone.Model.extend({
		defaults: {
		id: "Not specified",
		nome: "Not specified",
		cognome: "Not specified",
		mail: "Not specified",
		username: "Not specified",
		password: "Not specified",
		confermato: false
	},
	constructorName: "Amministratore"
	});

	return Amministratore;
});

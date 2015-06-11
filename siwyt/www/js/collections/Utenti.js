define(function(require) {

	var Backbone = require("backbone");
	var Utente = require("models/Utente");

	var Utenti = Backbone.Collection.extend({
		constructorName: "Utente",
		model: Utente
	});

	return Utenti;
});
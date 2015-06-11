define(function(require) {

	var Backbone = require("backbone");

	var Commento = Backbone.Model.extend({
	defaults: {
		id: "",
		contenuto: "",
		autore: "",
		data: "",
		ora: "",
	},
	constructorName: "Commento"


	return Commento;
});

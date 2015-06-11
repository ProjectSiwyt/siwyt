define(function(require) {

	var Backbone = require("backbone");

	var Postit = Backbone.Model.extend({
		defaults: {
			id: "",
			contenuto: "",
			autore: "",
			data: "",
			ora: "",
		},
		constructorName: "Postit"
	});

	return Postit;
});


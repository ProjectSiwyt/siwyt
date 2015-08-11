define(function(require) {

	var Backbone = require("backbone");

	var Amministratore = Backbone.Model.extend({
		defaults: {
			id: "",
			idu: "",
			idb: ""
		},
	
		constructorName: "Amministratore",



	});

	return Amministratore;
});

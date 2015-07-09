define(function(require) {

	var Backbone = require("backbone");

	var Utente = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			nome: "Not specified",
			cognome: "Not specified",
			mail: "Not specified",
			username: "Not specified",
			password: "Not specified",
			confermato: "false"
		},
		constructorName: "Utente",
		
		parse: function(response) {
        	//unwrap the response from the server....
        	if (response.data) return response.data;
        	return response;
    	}
	});

	return Utente;
});

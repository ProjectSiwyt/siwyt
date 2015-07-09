define(function(require) {

	var Backbone = require("backbone");

	var Amministratore = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			idUtente: "Not specified",
			idBacheca: "Not specified",
		},
	
		constructorName: "Amministratore",

		parse: function(response) {
        	//unwrap the response from the server....
        	if (response.data) return response.data;
        	return response;
    	}
	});

	return Amministratore;
});

define(function(require) {

	var Backbone = require("backbone");

	var Contatto = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			id1: "Not specified",
			id2: "Not specified",
		},
	
		constructorName: "Contatto",

		parse: function(response) {
        	//unwrap the response from the server....
        	if (response.data) return response.data;
        	return response;
    	},

    	// funzione che cancella il contatto tra id1 e id2
    	removeContact: function(id1, 1d2){
			console.log("contatto cancelato");
		}
	});

	return Amministratore;
});

define(function(require) {

	var Backbone = require("backbone");

	var Responsabile = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			idu: "Not specified",
			idb: "Not specified"
		},
		
		constructorName: "Responsabile",

		parse: function(response) {
        	//unwrap the response from the server....
        	if (response.data) return response.data;
        	return response;
    	}
	});

	return Responsabile;
});

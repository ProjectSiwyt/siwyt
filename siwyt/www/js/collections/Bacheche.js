define(function(require) {

	var Backbone = require("backbone");
	var Bacheca = require("models/Bacheca");

	var Bacheche = Backbone.Collection.extend({
		constructorName: "Bacheche",
		model: Bacheca,

		url : function(){
			//endPoint è il percorso
    		return BaasBox.endPoint + "/document/Bacheca";
  		},
  		
  		parse: function(response) {
      		//unwrap the response from the server....
      		if (response.data) return response.data;
      		return response;
  		}
	});

	return Bacheche;
});
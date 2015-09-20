define(function(require) {

	var Backbone = require("backbone");
	var Utente = require("models/Utente");

	var Utenti = Backbone.Collection.extend({
		constructorName: "Utente",
		model: Utente,
		
		url : function(){
			//endPoint è il percorso
			return BaasBox.endPoint + "/document/Utente";
  		},
  		
  		parse: function(response) {
      		//unwrap the response from the server....
      		console.log(response.data);
      		if (response.data) return response.data;
      		return response;
  		}

	});
	//console.log(Utenti);

	return Utenti;
});
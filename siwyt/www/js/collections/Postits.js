define(function(require) {

	var Backbone = require("backbone");
	var Postit = require("models/Postit");

	var Postits = Backbone.Collection.extend({
		constructorName: "Postits",
		model: Postit,

		url : function(){
			//endPoint è il percorso
    		//return BaasBox.endPoint + "/document/Postit";
  		},
  		
  		parse: function(response) {
      		//unwrap the response from the server....
      		if (response.data) return response.data;
      		return response;
  		}
	});



	return Postits;
});
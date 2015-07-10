define(function(require) {

	var Backbone = require("backbone");

	var Bacheca = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			nome: "Not specified"
		},
		constructorName: "Bacheca",
		
		parse: function(response) {
        	//unwrap the response from the server....
        	if (response.data) return response.data;
        	return response;
    	},

    	a: function(){
    		alert("asdf");
    	},

    	//restituisce i dati della bacheca con id uguale a quello passato come parametro
    	noticeboardData: function(id){
    		console.log(id);
    		var THIS = this;	
    		BaasBox.loadCollection("Bacheca")
        		
        		.done(function(res) {
	          		console.log("res ", res);

	          		for (var i=0; i<res.length; i++){
	            		if( res[i].id == id){
	            			console.log(res[i]);
	            			THIS.trigger("evento",res[i]);
	            			//return res[i];
	              		}
	            	}
          		})
				.fail(function(error) {
	          		console.log("error ", error);
	          		THIS.trigger("error")
				})
    	},

    	//modifytitle: function(id, titolo){} 
    	

	});

	return Bacheca;
});

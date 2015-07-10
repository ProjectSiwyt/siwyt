define(function(require) {

	var Backbone = require("backbone");

	var Postit = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			idb: "",
			contenuto: "Not specified",
			autore: "",
			data: "Not specified",
			ora: "Not specified",
			altezza: "",
			larghezza: "",
			x: "",
			y: ""

		},
		constructorName: "Postit",
		//restituisci i postits della bacheca con id uguale a quello passato come parametro
		elencoPostit: function(idb){
			console.log(idb);

			var THIS = this;	
    		BaasBox.loadCollection("Postit")
        		
        		.done(function(res) {
	          		console.log("res ", res);

	          		var a= new Array();
	             	var c=0;

	          		for (var i=0; i<res.length; i++){
	            		if( res[i].idb == idb){
	            			a[c++] = res[i];
	              		}
	            	}
	            	THIS.trigger("elencopostits", a);
          		})
				.fail(function(error) {
	          		console.log("error ", error);
	          		THIS.trigger(error);
				})
		}

		/*
		setbacheca: function(id){
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
				})
    	},
    	*/
	});

	return Postit;
});


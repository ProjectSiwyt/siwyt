define(function(require) {

	var Backbone = require("backbone");

	var Contatto = Backbone.Model.extend({
		defaults: {
			id: "",
			id1: "",
			id2: ""
		},
		constructorName: "Contatto",

		aggiungiContatto: function(id1, id2){
			
			var THIS=this;
			var post = new Object();
			post.id1 = id1;
			post.id2 = id2;

			BaasBox.save(post, "Contatto")
				.done(function(res) {
					//THIS.trigger("eventoLukzen", res);
				})
				.fail(function(error) {
					THIS.trigger("error", true);
				})

		},

   		//Prende come parametri due id e rimuove la riga corrispondente della tabella 'Contatto'
   		rimuoviContatto: function(id1, id2){
   			var THIS =	this;
			
			BaasBox.loadCollection("Contatto")

				.done(function(res) {
					
					console.log("res ", res);
					
					for(var i=0; i<res.length; i++){
						
						if(res[i].id1 == id1 && res[i].id2 == id2 || res[i].id1 == id2 && res[i].id2 == id1){
							
							BaasBox.deleteObject(res[i].id, "Contatto")
								.done(function(res) {
									THIS.trigger("contattoCancellato", true);
									console.log("r ", res);

								})
								.fail(function(error) {
									console.log("e ", e);
									THIS.trigger("contattoCancellato", false);
								})
						}
					}
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		}
   		
	});

	return Contatto;
});

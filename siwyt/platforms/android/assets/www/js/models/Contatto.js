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

   		rimuoviContatto: function(idc){
   			BaasBox.deleteObject(idc, "Contatto")
				.done(function(res) {
					console.log("res ", res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		}
   		
	});

	return Contatto;
});

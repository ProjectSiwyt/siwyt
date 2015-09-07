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
					console.log("contatto aggiunto");
					THIS.setPermission(res);
				})
				.fail(function(error) {
					console.log("error aggiungiContatto");
					THIS.trigger("resultAggiungiContatto", false);
				})

		},

		setPermission: function(result){
			var THIS = this;
			console.log("result contatto", result, result.id);
			BaasBox.grantRoleAccessToObject("Contatto",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			    console.log("res ", res);
			    THIS.trigger("resultAggiungiContatto", res.id2);
			  })
			  .fail(function(error) {
			    console.log("error permission", error);
			  })
		},

		aggiungiContattoConNotifica: function(id1, id2){
			
			var THIS=this;
			var post = new Object();
			post.id1 = id1;
			post.id2 = id2;

			BaasBox.save(post, "Contatto")
				.done(function(res) {
					BaasBox.sendPushNotification({"message" : "sei stato aggiunto a una lista contatti", "users" : [id2]})
					  .done(function(res) {
					  	console.log("contatto aggiunto con notifica");
					  	THIS.trigger("resultAggiungiContatto", post.id2);
					    console.log("res ", res);
					  })
					  .fail(function(error) {
					  	THIS.trigger("resultAggiungiContatto", false);
					    console.log("error ", error);
					  })
				})
				.fail(function(error) {
					THIS.trigger("resultAggiungiContatto", false);
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
									THIS.trigger("contattoCancellato", id1);
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

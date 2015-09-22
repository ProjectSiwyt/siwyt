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
					    BaasBox.loadCollectionWithParams("Utente", {where: "id='"+result.id2+"'" })
					  			.done(function(user){
								 	BaasBox.sendPushNotification({"message" : localStorage.getItem("nameLogged")+" "+localStorage.getItem("surnameLogged")+" has added you in his contacts'" , "users" : [user[0].username], "badge" : 1, "sound" : "sound.aiff"})
										  .done(function(res1) {
										  	console.log( res1);
										  })
										  .fail(function(error) {
										  	console.log("error sendPushNotification ", error);
										  })
								 })
								 .fail(function(error2) {
								 	console.log(error2)
								 })
			    THIS.trigger("resultAggiungiContatto", result.id2);
			  })
			  .fail(function(error) {
			    console.log("error permission", error);
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
									BaasBox.loadCollectionWithParams("Utente", {where: "id='"+res.id1+"'" })
								  			.done(function(user){
											 	BaasBox.sendPushNotification({"message" : localStorage.getItem("nameLogged")+" "+localStorage.getItem("surnameLogged")+" has deleted you from his contacts'" , "users" : [user[0].username], "badge" : 1, "sound" : "sound.aiff"})
													  .done(function(res1) {
													  	console.log( res1);
													  })
													  .fail(function(error) {
													  	console.log("error sendPushNotification ", error);
													  })
											 })
											 .fail(function(error2) {
											 	console.log(error2)
											 })
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

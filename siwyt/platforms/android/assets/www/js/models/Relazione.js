define(function(require) {

	var Backbone = require("backbone");

	var Relazione = Backbone.Model.extend({
		defaults: {
			id: "",
			idp1: "",
			idp2: "",
			etichetta: "",
			xp1: "",
			yp1: "",
			xp2: "",
			yp2: ""
		},

		constructorName: "Relazione",

		//aggiunge una nuova riga alla collezione Commento
		aggiungiRelazione: function(idp1, idp2, etichetta, xp1, yp1, xp2, yp2){

			var THIS = this;
			
			var post = new Object();
			post.idp1 = idp1;
			post.idp2 = idp2;
			post.etichetta = etichetta;
			post.xp1 = xp1;
			post.yp1 = yp1;
			post.xp2 = xp2;
			post.yp2 = yp2;
			
			BaasBox.save(post, "Relazione")
				.done(function(res) {
					console.log("ok");
					//THIS.trigger("eventoAggiungiPostit", true);
				})
				.fail(function(error) {
					console.log("errore");
					//THIS.trigger("errorAggiungiPostit", false);
				})
		},

		//funzione che cambia l'etichetta della 'Relazione' con id idr
		modificaEtichetta: function(idr, etichetta){
		var THIS = this;
			BaasBox.updateField(idr, "Relazione", "etichetta", etichetta)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoModificaEtichetta", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorModificaEtichetta", false);
				})
		},

		//funzione che cambia la posizione della 'Relazione' con id idr
		modificaPosizione: function(idr, xp1, yp1, xp2, yp2){
		var THIS = this;
			BaasBox.updateField(idr, "Relazione", "xp1", xp1, "yp1", yp1, "xp2", xp2, "yp2", yp2)
				.done(function(res) {
					console.log("res ", res);
					//THIS.trigger("eventoModificaPosizione", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorModificaPosizione", false);
				})
		},

		//rimuove dalla tabella 'Relazione' la riga con id idr
   		rimuoviRelazione: function(idr){
   			BaasBox.deleteObject(idr, "Relazione")
				.done(function(res) {
					console.log("res ", res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		}


	});

	return Relazione;
});

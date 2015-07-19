define(function(require) {

	var Backbone = require("backbone");

	var Postit = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			idb: "",
			contenuto: "Not specified",
			idu: "",
			data: "Not specified",
			ora: "Not specified",
			altezza: "",
			larghezza: "",
			x: "",
			y: ""

		},
		constructorName: "Postit",

		postitData: function(idp){
    		var THIS=this;
			BaasBox.loadCollectionWithParams("Postit", {where: "id='"+idp+"'" })
			 .done(function(res) {
			 	THIS.trigger("datiPostit", res);
			 })
			 .fail(function(error) {
			 	THIS.trigger("error",error);
			 })
		},
		//restituisci i postit della bacheca con id uguale a quello passato come parametro
		elencoPostitBacheca: function(idb){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Postit", {where: "idb='"+idb+"'" })
				.done(function(res) {
					console.log("res ", res);

					THIS.trigger("elencopostits ", res);
				})
				.fail(function(error) {
					console.log("errorElencopostits ", error);
				})
		},

		//restituisci i postit della bacheca con id uguale a quello passato come parametro
		elencoPostitUtente: function(idu){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Postit", {where: "idu='"+idu+"'" })
				.done(function(res) {
					console.log("res ", res);

					//THIS.trigger("eventoElencopostits ", res);
				})
				.fail(function(error) {
					console.log("errorElencopostits ", error);
				})
		},


		//aggiunge una nuova riga alla collezione Postit
		aggiungiPostit: function(idb, contenuto, idu, altezza, larghezza, x, y){

			var THIS = this;

			var d = new Date();
			var data = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
			var ora = d.getHours() + ":" + d.getMinutes();

			var post = new Object();
			post.idb = idb;
			post.contenuto = contenuto;
			post.idu = idu;
			post.data = data;
			post.ora = ora;
			post.altezza = altezza;
			post.larghezza = larghezza;
			post.x = x;
			post.y = y;

			BaasBox.save(post, "Postit")
				.done(function(res) {
					THIS.trigger("eventoAggiungiPostit", res);
				})
				.fail(function(error) {
					THIS.trigger("errorAggiungiPostit", error);
				})
		},

		//funzione che cambia il contenuto del postit con id idp
		saveContenuto: function(idp, contenuto){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "contenuto", contenuto)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveContenuto", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveContenuto", false);
				})
		},
		//funzione che cambia il contenuto del postit con id idp
		saveXY: function(idp, x, y){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "x", x)
				.done(function(res) {
					console.log("res ", res);

					THIS.saveY(idp,y);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("error", error);
				})
		},
		saveY: function(idp,y){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "y", y)
				.done(function(res) {
					console.log("res ", res);

					THIS.trigger("eventoSaveXY", res);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("error", error);
				})
		},
		//funzione che cambia il contenuto del postit con id idp
		saveHW: function(idp, h,w){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "altezza", h)
				.done(function(res) {
					console.log("res ", res);
					THIS.saveW(idp,w);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("error", error);
				})
		},
		saveW: function(idp,w){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "larghezza", w)
				.done(function(res) {
					console.log("res ", res);
					THIS.tigger("eventoSaveHW", res);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("error", error);
				})
		},

		//funzione che cambia la data del postit con id idp
		saveData: function(idp, data){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "data", data)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveData", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveData", false);
				})
		},

		//funzione che cambia l'ora del postit con id idp
		saveOra: function(idp, ora){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "ora", ora)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveOra", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveOra", false);
				})
		},

		//rimuove dalla tabella 'Postit' la riga con id idp
   		rimuoviPostit: function(idp){
   			BaasBox.deleteObject(idp, "Postit")
				.done(function(res) {
					console.log("res ", res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},
   		 //restituisci il nome dell'autore del postit 
        nomeAutore: function(idu){ 
        var THIS = this; 
         
            BaasBox.loadCollectionWithParams("Utente", {where: "id='"+idu+"'" }) 
                .done(function(res) { 
                    console.log("res ", res); 
 
                    THIS.trigger("datiAutore", res[0].nome+" "+res[0].cognome); 
                }) 
                .fail(function(error) { 
                    console.log("errorElencopostits ", error); 
                }) 
        }
		

	});

	return Postit;
});


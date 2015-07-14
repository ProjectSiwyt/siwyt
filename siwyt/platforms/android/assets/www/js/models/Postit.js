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


		//restituisci i postits della bacheca con id uguale a quello passato come parametro
		//OK
		elencoPostit: function(idb){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Postit", {where: "idb='"+idb+"'" })
				.done(function(res) {
					console.log("res ", res);

					THIS.trigger("eventoElencopostits ", res);
				})
				.fail(function(error) {
					console.log("errorElencopostits ", error);
				})
		},


		aggiungiPostit: function(idb, contenuto, idu, altezza, larghezza, x, y){

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
					THIS.trigger("eventoAggiungiPostit", true);
				})
				.fail(function(error) {
					THIS.trigger("errorAggiungiPostit", false);
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


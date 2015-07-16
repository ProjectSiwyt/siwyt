define(function(require) {

	var Backbone = require("backbone");

	var Commento = Backbone.Model.extend({
		defaults: {
			id: "", //id del commento
			idp: "", //id del postit
			contenuto: "",
			idu: "", //id del utente
			data: "",
			ora: ""
		},

		constructorName: "Commento",

		//aggiunge una nuova riga alla collezione Commento
		aggiungiCommento: function(idc, idp, contenuto, idu){

			var THIS = this;

			var d = new Date();
			var data = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
			var ora = d.getHours() + ":" + d.getMinutes();

			var post = new Object();
			post.idp = idp;
			post.contenuto = contenuto;
			post.idu = idu;
			post.data = data;
			post.ora = ora;
			
			BaasBox.save(post, "Commento")
				.done(function(res) {
					//THIS.trigger("eventoAggiungiPostit", true);
				})
				.fail(function(error) {
					//THIS.trigger("errorAggiungiPostit", false);
				})
		},

		//funzione che cambia il contenuto del 'Commento' con id idc
		saveContenuto: function(idc, contenuto){
			var THIS = this;
			BaasBox.updateField(idc, "Commento", "contenuto", contenuto)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveCommento ", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveCommento ", false);
				})
		},

		//funzione che cambia la data del 'Commento' con id idc
		saveData: function(idc, data){
			var THIS = this;
			BaasBox.updateField(idc, "Commento", "data", data)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveDataCommento", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveDataCommento", false);
				})
		},

		//funzione che cambia l'ora del 'Commento' con id idc
		saveOra: function(idc, ora){
			var THIS = this;
			BaasBox.updateField(idc, "Commento", "ora", ora)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveOraCommento", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveCommento", false);
				})
		},

		//rimuove dalla tabella 'Commento' la riga con id idc
   		rimuoviCommento: function(idc){
   			BaasBox.deleteObject(idc, "Commento")
				.done(function(res) {
					console.log("res ", res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		}

	});

	return Commento;
});

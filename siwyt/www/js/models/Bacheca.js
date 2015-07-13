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

    	
    	//passandogli un'array r contenente gli idb restituisce un'array contenente tutti i dati della bacheca con id idb
    	listaDatiBacheche: function(r){
    		var a = new Array();
    		var THIS = this;
    		
    		console.log(r);
    		
    		BaasBox.loadCollection("Bacheca")
				.done(function(res) {
					for(var i=0; i<r.length; i++){
						for(var j=0; j<res.length; j++){
							if(r[i].idb == res[j].id){
								a[i] = res[j];
								break;
							}
						}
					}
					THIS.trigger("eventolistabacheche", a);					

				})
				.fail(function(error2) {
					console.log("error ", error2);
				})
    	},
		

    	//funzione che ritorna un array contenente gli idb dell'utente con id idu
		//OK
		listaIdBacheche: function(){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Bacheca_Utente", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					console.log("res ", res);

					THIS.trigger("eventoidbacheche" , res);
				})
				.fail(function(error) {
					console.log("errorlistabacheche ", error);
				})
		},

		//funzione che ritorna un array contenente gli idu della bacheca con id=idb
		//CONTROLLARE	
		listaIdMembriDiUnaBacheca: function(idb){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Bacheca_Utente", {where: "idb='"+idb+"'" })
				.done(function(res) {
					console.log("res ", res);

					THIS.trigger("eventoidmembri" , res);
				})
				.fail(function(error) {
					console.log("erroridmembri", error);
				})
		},

		//DA FARE PER NICHOLAS la funzione prende come parametro un'array r contenente gli idu di utenti della bacheca corrente
		// e restituisce un'array contenente tutti i dati degli utenti con id idu 
		listaDatiMembriDiUnaBacheca: function(r){
			var THIS=this
			var a = new Array()
			//riempire array con dati utente il cui id è uguale ad uno di quelli nell'array
			THIS.trigger("eventolistamembri", a)
		},

		//FUNZIONA MA HO SCRITTO IO PER PROVARE PER NICHOLAS
		salvaBacheca:function(nome){
			var THIS=this;
			var post = new Object();
			post.nome = nome;   
			BaasBox.save(post, "Bacheca")
				.done(function(res) {
					THIS.trigger("salvataggiobacheca", res);
				})
				.fail(function(error) {
					THIS.trigger("erroresalvataggiobacheca", true);
				})
		},

    	//restituisce i dati della bacheca con id uguale a quello passato come parametro
    	/*
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
  		*/


  		//restituisce i dati relativi alla bacheca con id uguale a quello passato come parametro
    	noticeboardData: function(idb){
    		var THIS=this;
			BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+idb+"'" })
			 .done(function(res) {
			 	console.log("res ", res);
			 	THIS.trigger("evento", res);
			 })
			 .fail(function(error) {
			 	console.log("error ", error);
			 	THIS.trigger("error");
			 })
		},


		//Questa funzione sostituisce il titolo della bacheca con 'nuovo'
		//OK
   		modificaTitolo: function(idb, nuovo){
			var THIS = this;
			BaasBox.updateField(idb, "Bacheca", "nome", nuovo)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventomodificaTitolo", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errormodificaTitolo", false);
				})
   		}, 


   		//aggiungi gli 'Utenti' con id idu alla bacheca con id 'idb'
   		//MODIFICARE PER NICHOLAS
   		salvaUtenti: function(idu, idb){
   			var THIS=this;
			var post = new Object();
			post.idu = idu;
			post.idb = idb;     
			BaasBox.save(post, "Bacheca_Utente")
			.done(function(res) {
				THIS.trigger("salvataggiomembri", true);
			})
			.fail(function(error) {
				THIS.trigger("errorAggiungiMembro", true);
			})
   		},


		//rimuove un 'Utente' con id idu alla bacheca con id 'idb'
   		//CONTROLLARE -> funziona con l'id della riga!!!!! VEDERE BENE
   		rimuoviUtente: function(idu, idb){
   			BaasBox.delete("090dd688-2e9a-4dee-9afa-aad72a1efa93", "posts")
			.done(function(res) {
				console.log("res ", res);
			})
			.fail(function(error) {
				console.log("error ", error);
			})
   		},


   		//aggiunge un 'amministratore' con id idu alla bacheca con id 'idb'
   		//FUNZIONA PER NICHOLAS
   		salvaAmministratore: function(idu, idb){
   			var THIS=this;
   			var post = new Object();
			post.idu = idu;
			post.idb = idb;     
			BaasBox.save(post, "Amministratore")
				.done(function(res) {
					THIS.trigger("salvataggioAmministratore", true);
				})
				.fail(function(error) {
					THIS.trigger("errorSettaAmministratore", true);
				})
   		},


   		//aggiunge i 'responsabili' con id idu alla bacheca con id 'idb'
   		//MODIFICARE PER NICHOLAS
   		salvaResponsabili: function(idu, idb){
   			var THIS=this;
   			var post = new Object();
			post.idu = idu;
			post.idb = idb;     
			BaasBox.save(post, "Amministratore")
				.done(function(res) {
					THIS.trigger("salvataggioResponsabili", true);
				})
				.fail(function(error) {
					THIS.trigger("errorSettaResponsabile", true);
				})
   		},

    	
    	//conta le bacheche di cui l'utente con id=idu fa parte
    	//CONTROLLARE
    	contaBacheche: function(){
			var THIS=this;
			BaasBox.loadCollectionWithParams("Bacheca_Utente", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoContaBacheche", res.length);
				})
				.fail(function(error) {
					console.log("error ", error);
					THIS.trigger("errorContaBacheche");
				})
    	},
    	

	});

	return Bacheca;
});

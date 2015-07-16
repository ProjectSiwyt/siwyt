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

	    listaDatiBacheche2: function(r){
			var THIS = this;
			var a = new Array();
			var c=0;
			for(var i=0; i<r.length; i++){
				BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+r[i].idb+"'" })
					.done(function(res) {
						console.log("res ", res);
						a[c] = res;
						c++;
						if(c == r.length){
							THIS.trigger("eventolistabacheche", a);	
						}
					})
					.fail(function(error) {
						THIS.trigger("error", error);
					})
			}
		},

    	//funzione che ritorna un array contenente gli idb dell'utente con id idu
		//OK
		listaIdBacheche: function(){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Bacheca_Utente", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					console.log("res ", res);
					THIS.listaDatiBacheche(res);
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

					THIS.listaDatiMembriDiUnaBacheca(res);
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
			//vedere se li restituisce tutti o se ne manca uno (se ne manca uno mettere <=)
			BaasBox.loadCollection("Utente")
				.done(function(res) {
					for(var i=0; i<r.length; i++){
						for(var j=0; j<res.length; j++){
							console.log(r[i].idu+" "+res[j].id);
							if(r[i].idu == res[j].id){
								a[i] = res[j];
								break;
							}
						}
					}
					console.log(a);
					THIS.trigger("datiMembri ", a);					

				})
				.fail(function(error2) {
					console.log("error ", error2);
					THIS.trigger("errorEventolistamembri", error);
				})
		},

		//si può provae come abbiamo fatto per salvaUtenti
		//PROVARE PER NICHOLAS
		listaDatiMembriDiUnaBacheca2:  function(r){
		var THIS = this;
			var a = new Array();
			var c=0;
			for(var i=0; i<r.length; i++){
				BaasBox.loadCollectionWithParams("Utente", {where: "id='"+r[i].idu+"'" })
				.done(function(res) {
					console.log("res ", res);
					a[c] = res;
					c++;
					if(c == r.length){
						console.log(a);
						THIS.trigger("eventolistamembri ", a);	
					}
				})
				.fail(function(error) {
				//console.log("erroridmembri", error);
					THIS.trigger("errorEventolistamembri", error);
				})
			}
		},

		//FUNZIONA MA HO SCRITTO IO PER PROVARE PER NICHOLAS
		salvaBacheca: function(nome){
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


  		//restituisce i dati relativi alla bacheca con id uguale a quello passato come parametro
    	noticeboardData: function(idb){
    		var THIS=this;
			BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+idb+"'" })
			 .done(function(res) {
			 	console.log("res ", res);
			 	THIS.trigger("datiBacheca", res);
			 })
			 .fail(function(error) {
			 	console.log("error ", error);
			 	THIS.trigger("error");
			 })
		},


		//Questa funzione sostituisce il nome della bacheca con 'nuovo'
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
   		salvaUtenti: function(r, idb){
	 		var THIS=this;
	  		var c=0;
	  		for(var i=0; i<r.length; i++){
				var post = new Object();
				post.idu = r[i].idu;
				post.idb = idb;     
				BaasBox.save(post, "Bacheca_Utente")
					.done(function(res) {
						c++;
						if(c == r.length-1){
							THIS.trigger("salvataggioUtenti", true);
						}
					})
					.fail(function(error) {
						THIS.trigger("errorAggiungiUtenti", true);
					})
			}
		},


   		//PER NICHOLAS fare rimuovi responsabili che prende un idu dell'amministratore -> cosa vuol dire?!??!

   		//dato un id bacheca, restituire i dati del 'Amministratore'
   		//OK 
   		idAmministratore: function(idb){
   			var THIS = this;
   			console.log("idb='"+idb+"'")
   			BaasBox.loadCollectionWithParams("Amministratore", {where: "idb='"+idb+"'" })
   				.done(function(res){
   					console.log("amministratore"+res)
   					THIS.datiAmministratore(res);
   				})
   				.fail(function(error) {
		            console.log(error);
		 		})
   		},

   		datiAmministratore: function(r){
			console.log("CCCC");
			var THIS = this;
			if(r.length!=0){		    	
			BaasBox.loadCollectionWithParams("Utente", {where: "id='"+r[0].idu+"'" })
				.done(function(res) {
				 	console.log("res ", res);
				 	THIS.trigger("datiAmministratore", res);
				})
				.fail(function(error) {
				 	console.log("error ", error);
				 	//THIS.trigger("error");
				})
			}       	
		},

   		//Per la funzione rimuoviAmministratore devo fare prima una query che mi ritorna l'id della riga
   		idRigaAmministratore: function(idu, idb){
			BaasBox.loadCollection("Amministratore")

				.done(function(res) {
					console.log("res ", res);
					for(var i=0; i<res.length; i++){
						if(res[i].idu == idu && res[i].idb == idb){
							console.log(res[i].id);
						}
					}
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},
   		//rimuove dalla tabella 'Amministratore' la riga con id idu
   		rimuoviAmministratore: function(idRiga){
   			BaasBox.deleteObject(idRiga, "Amministratore")
				.done(function(res) {
					console.log("res ", res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},

   		//aggiunge un 'amministratore' con id idu alla bacheca con id 'idb'
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

   		//aggiunge un responsabile con id idu alla bacheca con id 'idb'
   		salvaResponsabile: function(idu, idb){
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

   		//aggiunge un array di 'responsabili' con id idu alla bacheca con id 'idb'
   		salvaResponsabili: function(r, idb){
		 	var THIS=this;
	  		var c=0;
	  		for(var i=0; i<r.length; i++){
				var post = new Object();
				post.idu = r[i];
				post.idb = idb;     
				BaasBox.save(post, "Responsabile")
					.done(function(res) {
						c++;
						if(c == r.length-1){
							console.log(r);
							//THIS.trigger("salvataggioResponsabili", true);
						}
					})
					.fail(function(error) {
						console.log("errore"); 
						//THIS.trigger("errorSalvataggioResponsabili", true);
					})
			}
		},

		//restituisce un array contenente gli id dei responsabili della bacheca co id idb
		listaIdResponsabiliDiUnaBacheca: function(idb){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Responsabile", {where: "idb='"+idb+"'" })
				.done(function(res) {
					console.log("res ", res);
					THIS.listaDatiResponsabiliDiUnaBacheca(res);

				})
				.fail(function(error) {
					console.log("erroridmembri", error);
				})
		},

		// restituisce un'array contenente tutti i dati dei responsabili con id idu 
		listaDatiResponsabiliDiUnaBacheca: function(r){
			var THIS=this
			var a = new Array()
			
			BaasBox.loadCollection("Responsabile")
				.done(function(res) {
					for(var i=0; i<r.length; i++){
						for(var j=0; j<res.length; j++){
							console.log(r[i].idu+" "+res[j].id);
							if(r[i].idu == res[j].id){
								a[i] = res[j];
								break;
							}
						}
					}
					console.log(a);
					THIS.trigger("datiResponsabili", a);					

				})
				.fail(function(error2) {
					console.log("error ", error2);
					THIS.trigger("errorEventolistamembri", error);
				})
		},

   		//Per la funzione rimuoviResponsabile devo fare prima una query che mi ritorna l'id della riga
   		idRigaResponsabile: function(idu, idb){
			BaasBox.loadCollection("Responsabile")

				.done(function(res) {
					console.log("res ", res);
					for(var i=0; i<res.length; i++){
						if(res[i].idu == idu && res[i].idb == idb){
							console.log(res[i].id);
						}
					}
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},

   		//rimuove dalla tabella 'Responsabile' la riga con id idu
   		rimuoviResponsabile: function(idRiga){
   			BaasBox.deleteObject(idRiga, "Responsabile")
				.done(function(res) {
					console.log("res ", res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		}

	});

	return Bacheca;
});

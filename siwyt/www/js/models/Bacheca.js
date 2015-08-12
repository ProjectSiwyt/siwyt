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
    	listaDatiBachecheUtente: function(r){
    		var a = new Array();
    		var THIS = this;
    		
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
					THIS.trigger("bachecheutente", a);	
				})
				.fail(function(error2) {
					console.log("error ", error2);
				})
    	},
    
		//funzione che ritorna un array contenente gli idb dell'utente con id idu
		//OK
		listaIdBachecheUtente: function(){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Bacheca_Utente", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					THIS.listaDatiBachecheUtente(res);
				})
				.fail(function(error) {
					console.log("errorlistabacheche ", error);
				})
		},
		//passandogli un'array r contenente gli idb restituisce un'array contenente tutti i dati della bacheca con id idb
    	listaDatiBachecheResponsabile: function(r){
    		var a = new Array();
    		var THIS = this;
    		
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
					THIS.trigger("bachecheresponsabile", a);	
				})
				.fail(function(error2) {
					console.log("error ", error2);
				})
    	},
    
		//funzione che ritorna un array contenente gli idb dell'utente con id idu
		//OK
		listaIdBachecheResponsabile: function(){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Responsabile", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					THIS.listaDatiBachecheResponsabile(res);
				})
				.fail(function(error) {
					console.log("errorlistabacheche ", error);
				})
		},
		//passandogli un'array r contenente gli idb restituisce un'array contenente tutti i dati della bacheca con id idb
    	listaDatiBachecheAmministratore: function(r){
    		var a = new Array();
    		var THIS = this;
    		
    		BaasBox.loadCollection("Bacheca")
				.done(function(res) {
					for(var i=0; i<r.length; i++){
						for(var j=0; j<res.length; j++){
							if(r[i].idb == res[j].id){
								a[i] = res[j];
								//break;
							}
							//console.log(j);
						}
					}
					THIS.trigger("bachecheamministratore", a);	
				})
				.fail(function(error2) {
					console.log("error ", error2);
				})
    	},
    
		//funzione che ritorna un array contenente gli idb dell'utente con id idu
		//OK
		listaIdBachecheAmministratore: function(){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Amministratore", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					THIS.listaDatiBachecheAmministratore(res);
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
							if(r[i].idu == res[j].id){
								a[i] = res[j];
								break;
							}
						}
					}
					THIS.trigger("datiMembri ", a);					

				})
				.fail(function(error2) {
					console.log("error ", error2);
					THIS.trigger("errorEventolistamembri", error);
				})
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
			 	THIS.trigger("datiBacheca", res);
			 })
			 .fail(function(error) {
			 	THIS.trigger("error");
			 })
		},


		//Questa funzione sostituisce il nome della bacheca con 'nuovo'
   		modificaTitolo: function(idb, nuovo){
			var THIS = this;
			BaasBox.updateField(idb, "Bacheca", "nome", nuovo)
				.done(function(res) {
					THIS.trigger("eventomodificaTitolo", res);
				})
				.fail(function(error) {
				    THIS.trigger("errormodificaTitolo", error);
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
						if(c == r.length){
							THIS.trigger("salvataggioUtenti", res);
						}
					})
					.fail(function(error) {
						THIS.trigger("errorAggiungiUtenti", error);
					})
			}
		},


   		//PER NICHOLAS fare rimuovi responsabili che prende un idu dell'amministratore -> cosa vuol dire?!??!

   		//dato un id bacheca, restituire i dati del 'Amministratore'
   		//OK 
   		idAmministratore: function(idb){
   			var THIS = this;
   			BaasBox.loadCollectionWithParams("Amministratore", {where: "idb='"+idb+"'" })
   				.done(function(res){
   					THIS.datiAmministratore(res);
   				})
   				.fail(function(error) {
		            console.log(error);
		 		})
   		},

   		datiAmministratore: function(r){
			var THIS = this;
			if(r.length!=0){		    	
			BaasBox.loadCollectionWithParams("Utente", {where: "id='"+r[0].idu+"'" })
				.done(function(res) {
				 	THIS.trigger("datiAmministratore", res);
				})
				.fail(function(error) {
				 	console.log("error ", error);
				 	//THIS.trigger("error");
				})
			}       	
		},
		rimuoviBacheca: function(idb){
   			var THIS=this;
   			BaasBox.deleteObject(idb, "Bacheca")
				.done(function(res) {
					THIS.trigger("rimuoviBacheca", idb);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},

   		//Per la funzione rimuoviAmministratore devo fare prima una query che mi ritorna l'id della riga
   		idRigaAmministratore: function(idu, idb){
			var THIS=this;
			BaasBox.loadCollection("Amministratore")

				.done(function(res) {
					for(var i=0; i<res.length; i++){
						if(res[i].idu == idu && res[i].idb == idb){
							THIS.rimuoviAmministratore(res[i].id);
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
					THIS.trigger("rimossoAmministratore",res);
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
			BaasBox.save(post, "Responsabile")
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
				post.idu = r[i].idu;
				post.idb = idb;   
				BaasBox.save(post, "Responsabile")
					.done(function(res) {
						c++;
						if(c == r.length){
							THIS.trigger("salvataggioResponsabili", true);
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
			
			BaasBox.loadCollection("Utente")
				.done(function(res) {
					for(var i=0; i<r.length; i++){
						for(var j=0; j<res.length; j++){
							if(r[i].idu == res[j].id){
								a[i] = res[j];
								break;
							}
						}
					}
					THIS.trigger("datiResponsabili", a);					

				})
				.fail(function(error2) {
					THIS.trigger("errorEventolistamembri", error2);
				})
		},

   		 //Per la funzione rimuoviResponsabili devo fare prima una query che mi ritorna un array contenente gli id delle righe 

           idRigheResponsabili: function(r, idb){
            var a= new Array();
 				var c =0;
 				var THIS=this;
            BaasBox.loadCollection("Responsabile") 
                .done(function(res) { 
                    for(var i=0; i<r.length; i++){
                        for(var j=0; j<res.length; j++){ 
                            if(r[i].idu == res[j].idu && res[j].idb==idb){ 
                                a[c++]=res[j]; 
                            }
                        } 
                    }

                    THIS.rimuoviResponsabili(a);
                }) 
                .fail(function(error) { 
                    console.log("error ", error); 
                }) 
           },

         
           //rimuove dalla tabella 'Responsabile' l'array passato come parametro 
           rimuoviResponsabili: function(r){
           	var THIS=this;
           	var c=0;
            for(var i=0; i<r.length; i++){ 
                   BaasBox.deleteObject(r[i].id, "Responsabile") 
                    .done(function(res) {
                    	c++; 
                    	if (c==r.length){
                    		THIS.trigger("rimuoviResponsabili", true);
                    	}
                    }) 
                    .fail(function(error) { 
                        console.log("error ", error); 
                    })
            } 
           },
           //Per la funzione rimuoviMembri devo fare prima una query che mi ritorna un array contenente gli id delle righe 

           idRigheMembri: function(r, idb){
            var a= new Array();
 				var c =0;
 				var THIS=this;
            BaasBox.loadCollection("Bacheca_Utente") 
                .done(function(res) { 
                    for(var i=0; i<r.length; i++){
                        for(var j=0; j<res.length; j++){ 
                            if(r[i].idu == res[j].idu && res[j].idb==idb){ 
                                a[c++]=res[j]; 
                            }
                        } 
                    }

                    THIS.rimuoviMembri(a);
                }) 
                .fail(function(error) { 
                    console.log("error ", error); 
                }) 
           },

         
           //rimuove dalla tabella 'Responsabile' l'array passato come parametro 
           rimuoviMembri: function(r){
           	var THIS=this;
           	var c=0;
            for(var i=0; i<r.length; i++){ 
                   BaasBox.deleteObject(r[i].id, "Bacheca_Utente") 
                    .done(function(res) {
                    	c++; 
                    	if (c==r.length){
                    		console.log("eliminato");
                    		THIS.trigger("rimuoviMembri", true); 
                    	}
                    }) 
                    .fail(function(error) { 
                        console.log("error ", error); 
                    })
            } 
           },
           idRigheTuttiResponsabili: function(idb){
	        var a= new Array();
			var c =0;
			var THIS=this;
	        BaasBox.loadCollection("Responsabile") 
	            .done(function(res) { 
	                for(var j=0; j<res.length; j++){ 
	                    if(idb == res[j].idb){ 
	                        a[c++]=res[j]; 
	                    }
	                } 
	                if (a.length!=0){
	                	THIS.rimuoviTuttiResponsabili(a);
	                }
	                else{
	                	THIS.trigger("rimuoviTuttiResponsabili", a)
	                }
	            }) 
	            .fail(function(error) { 
	                console.log("error ", error); 
	            }) 
	       },
	       rimuoviTuttiResponsabili: function(r){
           	var THIS=this;
           	var c=0;
            for(var i=0; i<r.length; i++){ 
                   BaasBox.deleteObject(r[i].id, "Responsabile") 
                    .done(function(res) {
                    	c++; 
                    	if (c==r.length){
                    		THIS.trigger("rimuoviTuttiResponsabili", r);
                    	}
                    }) 
                    .fail(function(error) { 
                        console.log("error ", error); 
                    })
            } 
           },
           idRigheTuttiMembri: function(idb){
	        var a= new Array();
			var c =0;
			var THIS=this;
	        BaasBox.loadCollection("Bacheca_Utente") 
	            .done(function(res) { 
	                for(var j=0; j<res.length; j++){ 
	                    if(idb == res[j].idb){ 
	                        a[c++]=res[j]; 
	                    }
	                }
	                if(a.length!=0){	
		                THIS.rimuoviTuttiMembri(a);
	                }
	                else{
	                	THIS.trigger("rimuoviTuttiMembri", a);
	                }
	            }) 
	            .fail(function(error) { 
	                console.log("error ", error); 
	            }) 
	       },
	       rimuoviTuttiMembri: function(r){
           	var THIS=this;
           	var c=0;
            for(var i=0; i<r.length; i++){ 
                   BaasBox.deleteObject(r[i].id, "Bacheca_Utente") 
                    .done(function(res) {
                    	c++; 
                    	if (c==r.length){
                    		THIS.trigger("rimuoviTuttiMembri", r);
                    	}
                    }) 
                    .fail(function(error) { 
                        console.log("error ", error); 
                    })
            } 
           },
           idRigheTuttiAmministratori: function(idb){
	        var a= new Array();
			var c =0;
			var THIS=this;
	        BaasBox.loadCollection("Amministratore") 
	            .done(function(res) { 
	                for(var j=0; j<res.length; j++){ 
	                    if(idb == res[j].idb){ 
	                        a[c++]=res[j]; 
	                    }
	                } 
	                if (a.length!=0){
	                	THIS.rimuoviTuttiAmministratori(a);
	                }
	                else{
	                	THIS.trigger("rimuoviTuttiAmministratori", a)
	                }
	            }) 
	            .fail(function(error) { 
	                console.log("error ", error); 
	            }) 
	       },
	       rimuoviTuttiAmministratori: function(r){
           	var THIS=this;
           	var c=0;
            for(var i=0; i<r.length; i++){ 
                   BaasBox.deleteObject(r[i].id, "Amministratore") 
                    .done(function(res) {
                    	c++; 
                    	if (c==r.length){
                    		THIS.trigger("rimuoviTuttiAmministratori", r);
                    	}
                    }) 
                    .fail(function(error) { 
                        console.log("error ", error); 
                    })
            } 
           }


	});

	return Bacheca;
});

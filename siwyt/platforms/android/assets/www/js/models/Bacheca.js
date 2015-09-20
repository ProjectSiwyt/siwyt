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


    	listaBachecheAmministratoreContact: function(idu, idu2){
            var THIS = this;

            BaasBox.loadCollectionWithParams("Amministratore", {where: "idu='"+idu+"'" })
                    .done(function(res) {
                    		console.log("bacheche user loggato", res);
                    		if(res.length<1) THIS.trigger("bachecheamministratore", null);
                    		else THIS.filtraBachecaUtente(res, idu2);
                            
                    })
                    .fail(function(error) {
                            console.log("errorlistabacheche ", error);
                    })
    	},

        filtraBachecaUtente: function(result, idu2){
            var THIS = this;
            var a = new Array();
            var j = 0;
            BaasBox.loadCollectionWithParams("Bacheca_Utente",{where: "idu='"+idu2+"'"})
                .done(function(res) {
                	console.log("bacheche utente idu2 ",res);
                	console.log("result (bacheche us loggato) ",result);
                	for(var c=0; c< res.length; c++){
                		for(var i=0; i<result.length; i++){
                			if(result[i].idb!=0){
	                			if(res[c].idb==result[i].idb)
	                				result[i]=0;
                			}
                		}
                	}
                	var k=0;
                    for(var i=0;i<result.length; i++){
                    	if(result[i]!=0){
                    		a[k]=result[i];
                    		k++;
                    	}
                    }
                    console.log("risultato filtro bachecha utente",a);
                    THIS.filtraBachecaResponsabile(a,idu2);
                    //THIS.listaDatiBachecheAmministratore(a);
                })
                .fail(function(error) {
                        console.log("errorlistabacheche ", error);
                })

    },

     filtraBachecaResponsabile: function(result, idu2){
            var THIS = this;
            var a = new Array();
            var j = 0;
            BaasBox.loadCollectionWithParams("Responsabile",{where: "idu='"+idu2+"'"})
                .done(function(res) {
                	console.log("bacheche responsabile idu2",res);
                	for(var c=0; c< res.length; c++){
                		for(var i=0; i<result.length; i++){
                			if(result[i].idb!=0){
                				if(res[c].idb==result[i].idb)
                					result[i]=0;
                			}
                		}
                	}
                	var k=0;
                    for(var i=0;i<result.length; i++){
                    	if(result[i]!=0){
                    		a[k]=result[i];
                    		k++;
                    	}
                    }
                    console.log("ris finale",a);
                    if(a.length>0)
                    	THIS.listaDatiBachecheAmministratore(a);
                	else
                		THIS.trigger("bachecheamministratore", 0);

                })
                .fail(function(error) {
                        console.log("errorlistabacheche ", error);
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

		contaBachecheResponsabile: function(){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Responsabile", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					console.log(" numBachecheResponsabile", res.length);
					THIS.trigger("numBachecheResponsabile", res.length);
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

    	contaBachecheAmministratore: function(){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Amministratore", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					console.log("numBachecheAmministratore ", res.length);
					THIS.trigger("numBachecheAmministratore " , res.length);
				})
				.fail(function(error) {
					console.log("errorlistabacheche ", error);
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

		setPermission: function(result,document_name, trigger_nome, trigger_value){
   			var THIS = this;
			console.log("result", result, result.id);
			BaasBox.grantRoleAccessToObject(document_name,result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			    console.log("res ", res);
			    THIS.trigger('"'+trigger_nome+'"', trigger_value); 
			  })
			  .fail(function(error) {
			    console.log("error permission", error);
			  })
   		},

		//FUNZIONA MA HO SCRITTO IO PER PROVARE PER NICHOLAS
		salvaBacheca: function(nome){
			var THIS=this;
			var post = new Object();
			post.nome = nome;   
			BaasBox.save(post, "Bacheca")
				.done(function(res) {
					THIS.setPermissionSalvaBacheca(res);
				})
				.fail(function(error) {
					THIS.trigger("erroresalvataggiobacheca", true);
				})
		},

		setPermissionSalvaBacheca: function(result){
			var THIS = this;
			console.log("result setPermissionSalvaBacheca", result, result.id);
			BaasBox.grantRoleAccessToObject("Bacheca",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			    console.log(" setPermissionSalvaBacheca ", res);
			    THIS.trigger("salvataggiobacheca", result);
			  })
			  .fail(function(error) {
			    console.log("error setPermissionSalvaBacheca", error);
			  })
		},


  		//restituisce i dati relativi alla bacheca con id uguale a quello passato come parametro
    	noticeboardData: function(idb){
    		var THIS=this;
    		console.log("noticeboardData idb: ", idb);
			BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+idb+"'" })
			 .done(function(res) {
			 	console.log("dati bacheca", res);
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
						THIS.setPermissionSalvaUtenti(res);
						if(c == r.length){
							THIS.trigger("salvataggioUtenti", res);
						}
					})
					.fail(function(error) {
						THIS.trigger("errorAggiungiUtenti", error);
					})
			}
		},

		setPermissionSalvaUtenti: function(result){
			var THIS = this;
			console.log("result", result, result.id);
			BaasBox.grantRoleAccessToObject("Bacheca_Utente",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			  		BaasBox.loadCollectionWithParams("Utente", {where: "id='"+result.idu+"'" })
			  			.done(function(user){
			  				BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+result.idb+"'" })
								 .done(function(board) {
								 	BaasBox.sendPushNotification({"message" : localStorage.getItem("nameLogged")+" "+localStorage.getItem("surnameLogged")+" has added you as user to board '"+board[0].nome+"'", "users" : [user[0].username], "badge" : 1, "sound" : "sound.aiff"})
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
						})
						.fail(function(err){
							console.log("error",err);
						})
			  		
			    console.log("res setPermissionSalvaUtenti ", res);
			  })
			  .fail(function(error) {
			    console.log("error permission salvataggio utenti", error);
			  })
		},



		aggiungiUtenteBacheca: function(idu, idb){
	 		var THIS=this;
	  		
			var post = new Object();
			post.idu = idu;
			post.idb = idb;     
			BaasBox.save(post, "Bacheca_Utente")
				.done(function(res) {
					THIS.setPermissionAggiungiUtenteBacheca(res);
				})
				.fail(function(error) {
					THIS.trigger("errorAggiungiUtente", idu);
				})
			
		},

		aggiungiUtenteBacheche: function(idu, r){
	 		var THIS=this;
	  		var c=0;
	  		for(var i=0; i<r.length; i++){
					var post = new Object();
					post.idb = r[i];
					post.idu = idu;     
					BaasBox.save(post, "Bacheca_Utente")
						.done(function(res) {
							c++;
							THIS.setPermissionSalvaUtenti(res);
							if(c == r.length){
								THIS.trigger("salvataggioUtente", res);
							}
						})
						.fail(function(error) {
							THIS.trigger("errorAggiungiUtenti", error);
						})
			}
		},
			

		
		setPermissionAggiungiUtenteBacheca: function(result){
			var THIS = this;
			console.log("result", result, result.id);
			BaasBox.grantRoleAccessToObject("Bacheca_Utente",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			    console.log("res aggiungiUtenteBacheca ", res);
			    THIS.trigger("utenteAggiunto", result.idu);
			  })
			  .fail(function(error) {
			    console.log("error permission salvataggio utenti", error);
			  })
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
   			var THIS=this;
   			BaasBox.deleteObject(idRiga, "Amministratore")
				.done(function(res) {
					THIS.trigger("rimossoAmministratore",res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},
   		//Per la funzione rimuoviResponsabile devo fare prima una query che mi ritorna l'id della riga
   		idRigaResponsabile: function(idu, idb){
			var THIS=this;
			BaasBox.loadCollection("Responsabile")

				.done(function(res) {
					for(var i=0; i<res.length; i++){
						if(res[i].idu == idu && res[i].idb == idb){
							THIS.rimuoviResponsabile(res[i].id);
						}
					}
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},
   		//rimuove dalla tabella 'Responsabile' la riga con id idu
   		rimuoviResponsabile: function(idRiga){
   			var THIS=this;
   			BaasBox.deleteObject(idRiga, "Responsabile")
				.done(function(res) {
					THIS.trigger("rimossoResponsabile",res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},
   		//Per la funzione rimuoviUtente devo fare prima una query che mi ritorna l'id della riga
   		idRigaUtente: function(idu, idb){
			var THIS=this;
			BaasBox.loadCollection("Bacheca_Utente")

				.done(function(res) {
					for(var i=0; i<res.length; i++){
						if(res[i].idu == idu && res[i].idb == idb){
							THIS.rimuoviUtente(res[i].id);
						}
					}
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},
   		//rimuove dalla tabella 'Bacheca_Utente' la riga con id idu
   		rimuoviUtente: function(idRiga){
   			var THIS=this;
   			BaasBox.deleteObject(idRiga, "Bacheca_Utente")
				.done(function(res) {
					THIS.trigger("rimossoUtente",res);
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
					THIS.setPermissionSalvaAmministratore(res);
				})
				.fail(function(error) {
					THIS.trigger("errorSettaAmministratore", true);
				})
   		},

   		setPermissionSalvaAmministratore: function(result){
			var THIS = this;
			console.log("result", result, result.id);
			BaasBox.grantRoleAccessToObject("Amministratore",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			    console.log("res ", res);
			    THIS.trigger("salvataggioAmministratore", true); 
			  })
			  .fail(function(error) {
			    console.log("error permission", error);
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
					THIS.setPermissionSalvaResponsabile(res);
					/*THIS.trigger("salvataggioResponsabili", true);*/
				})
				.fail(function(error) {
					THIS.trigger("errorSettaResponsabile", true);
				})
   		},


   		setPermissionSalvaResponsabile: function(result){
			var THIS = this;
			console.log("result", result, result.id);
			BaasBox.grantRoleAccessToObject("Responsabile",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			    console.log("res ", res);
			    THIS.trigger("salvataggioResponsabili", true); 
			  })
			  .fail(function(error) {
			    console.log("error permission", error);
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
						THIS.setPermissionSalvaResponsabili(res);
						if(c == r.length){
							THIS.trigger("salvataggioResponsabili", true);
							/*THIS.trigger("salvataggioResponsabili", true);*/
						}
					})
					.fail(function(error) {
						console.log("errore"); 
						//THIS.trigger("errorSalvataggioResponsabili", true);
					})
			}
		},


		setPermissionSalvaResponsabili: function(result){
			var THIS = this;
			console.log("result", result, result.id);
			BaasBox.grantRoleAccessToObject("Responsabile",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			  		BaasBox.loadCollectionWithParams("Utente", {where: "id='"+result.idu+"'" })
			  			.done(function(user){
			  				BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+result.idb+"'" })
								 .done(function(board) {
								 	BaasBox.sendPushNotification({"message" : localStorage.getItem("nameLogged")+" "+localStorage.getItem("surnameLogged")+" has added you as administrator to board '"+board[0].nome+"'", "users" : [user[0].username], "badge" : 1, "sound" : "sound.aiff"})
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
						})
						.fail(function(err){
							console.log("error",err);
						})
			  		
			    console.log("res setPermissionSalvaResponsabili ", res);
			  })
			  .fail(function(error) {
			    console.log("error permission", error);
			  })
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
            		var riga=r[i];
            		BaasBox.loadCollectionWithParams("Utente", {where: "id='"+riga.idu+"'" })
			  			.done(function(user){
			  				BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+riga.idb+"'" })
								 .done(function(board) {
								 	console.log(board);
								 	BaasBox.sendPushNotification({"message" : localStorage.getItem("nameLogged")+" "+localStorage.getItem("surnameLogged")+" has removed you as admin to board '"+board[0].nome+"'", "users" : [user[0].username], "badge" : 1, "sound" : "sound.aiff"})
										  .done(function(res1) {
										  	console.log( res1);
										  })
										  .fail(function(error1) {
										  	console.log("error sendPushNotification ", error1);
										  })
								 })
								 .fail(function(error2) {
								 	console.log(error2)
								 })
						})
						.fail(function(err){
							console.log("error",err);
						})  
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
            		var riga=r[i];
                    BaasBox.loadCollectionWithParams("Utente", {where: "id='"+riga.idu+"'" })
			  			.done(function(user){
			  				console.log(r[i]);
			  				BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+riga.idb+"'" })
								 .done(function(board) {
								 	console.log(board);
								 	BaasBox.sendPushNotification({"message" : localStorage.getItem("nameLogged")+" "+localStorage.getItem("surnameLogged")+" has removed you as user to board '"+board[0].nome+"'", "users" : [user[0].username], "badge" : 1, "sound" : "sound.aiff"})
										  .done(function(res1) {
										  	console.log( res1);
										  })
										  .fail(function(error1) {
										  	console.log("error sendPushNotification ", error1);
										  })
								 })
								 .fail(function(error2) {
								 	console.log(error2)
								 })
						})
						.fail(function(err){
							console.log("error",err);
						})
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
            		var riga=r[i];
                    BaasBox.loadCollectionWithParams("Utente", {where: "id='"+riga.idu+"'" })
			  			.done(function(user){
			  				BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+riga.idb+"'" })
								 .done(function(board) {
								 	BaasBox.sendPushNotification({"message" : localStorage.getItem("nameLogged")+" "+localStorage.getItem("surnameLogged")+" has removed you as admin to board '"+board[0].nome+"'", "users" : [user[0].username], "badge" : 1, "sound" : "sound.aiff"})
										  .done(function(res1) {
										  	console.log( res1);
										  })
										  .fail(function(error1) {
										  	console.log("error sendPushNotification ", error1);
										  })
									
								 })
								 .fail(function(error2) {
								 	console.log(error2)
								 })
						})
						.fail(function(err){
							console.log("error",err);
						})
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
            		BaasBox.loadCollectionWithParams("Utente", {where: "id='"+riga.idu+"'" })
			  			.done(function(user){
			  				BaasBox.loadCollectionWithParams("Bacheca", {where: "id='"+riga.idb+"'" })
								 .done(function(board) {
								 	BaasBox.sendPushNotification({"message" : localStorage.getItem("nameLogged")+" "+localStorage.getItem("surnameLogged")+" has removed you as user to board '"+board[0].nome+"'", "users" : [user[0].username], "badge" : 1, "sound" : "sound.aiff"})
										  .done(function(res1) {
										  	console.log( res1);
										  })
										  .fail(function(error1) {
										  	console.log("error sendPushNotification ", error1);
										  })
								 })
								 .fail(function(error2) {
								 	console.log(error2)
								 })
						})
						.fail(function(err){
							console.log("error",err);
						})
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

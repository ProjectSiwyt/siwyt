define(function(require) {

	var Backbone = require("backbone");

	var Utente = Backbone.Model.extend({
		defaults: {
			id: "",
			nome: "",
			cognome: "",
			mail: "",
			username: "",
			password: "",
			confermato: ""
		},
		constructorName: "Utente",
		
		parse: function(response) {
        	//unwrap the response from the server....
        	if (response.data) return response.data;
        	return response;
    	},

    	
    		//BaasBox.loadCollectionWithParams("Contatto", {where:"id1==idu"})
    	//restituisce array contenente i nomi dei contatti dell'utente passatogli come parametro
		listContacts: function(idu){
			//console.log(idu);

			var THIS = this;	
	    	BaasBox.loadCollection("Contatto")
	       	
	       	.done(function(res) {
	         	//console.log("res ", res);

	         	var a= new Array();
	            var c=0;

	         	for (var i=0; i<res.length; i++){
		           	if( res[i].id1 == idu ){
						a[c] = res[i].id2;
						c++;
		           	}
		            if(res[i].id2 == idu){
		               	a[c] = res[i].id1;
		               	c++;
		             }
	           	}
	           	//console.log(a);
	           	//debugger;
	           	
			   	BaasBox.loadCollection("Utente")	             
			   	
			   	.done(function(res2) {
			   		
			   		var a2= new Array();
			   		//var ca=0;
			   		var c2=0;
			       	for(var i=0; i<a.length; i++){
			       		//console.log("asddddfasdf");
			       		for(var j=0; j<res2.length; j++){

			       			if(res2[j].id == a[i]){
			       				//console.log(res2[j].nome);
			       				a2[c2++] = res2[j];	
			       			}
			       		}
			       	}
			       	//console.log(a2);
			       	THIS.trigger("listContacts", a2);
			    })
		        
		        .fail(function(error) {
		               // gestione del caso di errore
		            console.log(error);
		        });
    		})
		
			.fail(function(error) {
	         	console.log("error ", error);
			})
		},


		//sospende l account di idu impedendo il login
		suspendAccount: function(idu){
			console.log(localStorage.getItem("usernameLogged"));
			$.ajax({
                  url:"http://192.168.1.225:9000/me/suspend",
                  method: "PUT"
                });
			this.logout();
		},


		//elimina tutte i riferimenti alle bacheche di cui l utente idu era utente semplice
		deleteUserDataUser: function(idu){
			console.log("deleteUserData ", idu);
			var THIS = this;
			BaasBox.loadCollectionWithParams("Bacheca_Utente", {where: "idu='"+idu+"'"})
			  .done(function(res) {
			  		var c =1;
			  		console.log(res);
			  		if(res.length==0) THIS.deleteUserDataAdmin(idu);
			  		else
			  			{
					  		for(var i=0; i<res.length; i++){
					  			BaasBox.deleteObject(res[i].id, "Bacheca_Utente")
									  .done(function(result) {
									  	if(c==res.length){
									  		
									  		c++;
									  	}
									  })
									  .fail(function(error) {
									    console.log("error ", error);
									  })
					  			}
					  		THIS.deleteUserDataAdmin(idu);
			  		}

				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("", false);
				})

		},

		// elimina tutti i riferimenti alle bacheche di cui l utente idu era amministratore
		deleteUserDataAdmin: function(idu){
			console.log("deleteUserDataAdmin ", idu);
			var THIS = this;
			BaasBox.loadCollectionWithParams("Responsabile", {where: "idu='"+idu+"'"})
			  .done(function(res) {
			  		var c =1;
			  		console.log("res ", res);
			  		if(res.length==0) THIS.deleteUserDataManager(idu);
			  		else
			  			{
				  		for(var i=0; i<res.length; i++){
				  			BaasBox.deleteObject(res[i].id, "Responsabile")
								  .done(function(result) {
								  	if(c==res.length){
								  		
								  		c++;
								  	}
								  })
								  .fail(function(error) {
								    console.log("error ", error);
								  })
				  			}
				  		THIS.deleteUserDataManager(idu);
				  		}
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("", false);
				})

		},

		// elimina tutti i riferimenti alle tabelle di cui lutente idu era manager
		deleteUserDataManager: function(idu){
			console.log("deleteUserDataManager ", idu);
			var THIS = this;
			BaasBox.loadCollectionWithParams("Amministratore", {where: "idu='"+idu+"'"})
			  .done(function(res) {
			  		var idb = new Array();
			  		console.log("res ", res);
			  		if(res.length==0) THIS.deleteUserContacts_id1(idu);
			  		else
			  			{
				  		for(var i=0; i<res.length; i++){
				  			idb[i]=res[i].idb;
				  			BaasBox.deleteObject(res[i].id, "Amministratore")
								  .done(function(result) {
								    
								  })
								  .fail(function(error) {
								    console.log("error ", error);
								  })
				  			}
				  		THIS.deleteUsersFromBacheca_Utente(idb, idu);
				  		}
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("", false);
				})

		},

		//quando un utente cancella il proprio account vengono cencellati tutti i record in Bacheca_Utente
		// riguardanti le bacheche di cui l'utente eliminato era manager
		deleteUsersFromBacheca_Utente: function(idb,idu){
			console.log("deleteUsersFromBacheca_Utente ", idu);
			var THIS = this;
			BaasBox.loadCollection("Bacheca_Utente")
			  .done(function(res) {
			  		for (var i=0; i<res.length; i++){
			  			for(var j=0; j<idb.length; j++){
			  				if(res[i].idb==idb[j]){
			  					BaasBox.deleteObject(res[i].id, "Bacheca_Utente")
								  .done(function(result) {
								  	console.log("eliminato record Bacheca_Utente: ");
								  })
								  .fail(function(error) {
								    console.log("error deleteUsersFromBacheca_Utente", error);
								  })
			  				}
			  			}
			  		}
			  		THIS.deleteUsersFromResponsabile(idb, idu);
			  		
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("", false);
				})

		},

		//quando un utente cancella il proprio account vengono cencellati tutti i record in Responsabile
		// riguardanti le bacheche di cui l'utente eliminato era manager
		deleteUsersFromResponsabile: function(idb,idu){
		console.log("deleteUsersFromResponsabile ", idu);
		var THIS = this;
		BaasBox.loadCollection("Responsabile")
		  .done(function(res) {
		  		for (var i=0; i<res.length; i++){
		  			for(var j=0; j<idb.length; j++){
		  				if(res[i].idb==idb[j]){
		  					BaasBox.deleteObject(res[i].id, "Responsabile")
							  .done(function(result) {
							  	console.log("eliminato record Responsabile: ");
							  })
							  .fail(function(error) {
							    console.log("error deleteUsersFromResponsabile", error);
							  })
		  				}
		  			}
		  		}
		  		THIS.deleteUserBoards(idb, idu);
		  		
			})
			.fail(function(error) {
			   	console.log("error ", error);
			    THIS.trigger("", false);
			})

		},


		//quando un utente cancella il proprio account vengono cencellate le bacheche di cui era manager
		deleteUserBoards: function(idb, idu){
			console.log("deleteUserBoards ",idb, idu);
			var THIS = this;
			var c =0;
			if(idb.length==0) THIS.deleteUserContacts_id1(idu)
			else{
		  		for(var i=0; i<idb.length; i++){
		  			BaasBox.deleteObject(idb[i], "Bacheca")
						  .done(function(result) {
						  	if(c==idb.length-1){
						  		THIS.deleteUserContacts_id1(idu);
						  	}
						  	c++;
						  })
						  .fail(function(error) {
						    console.log("error ", error);
						  })
		  			}
	  		}						

		},

		// cancella tutti i contatti dell utente idu in cui compare come id1
		deleteUserContacts_id1: function(idu){
			console.log("deleteUserContacts ", idu);
			var THIS = this;
			BaasBox.loadCollectionWithParams("Contatto", {where: "id1='"+idu+"'"})
			  .done(function(res) {
			  		console.log(res);
			  		var c =1;
			  		if(res.length==0) THIS.deleteUserContacts_id2(idu);
			  		else
			  			{
				  		for(var i=0; i<res.length; i++){
				  			BaasBox.deleteObject(res[i].id, "Contatto")
								  .done(function(result) {
								  	if(c==res.length){
								  		
								  		c++;
								  	}
								  })
								  .fail(function(error) {
								    console.log("error ", error);
								  })
				  			}
				  		THIS.deleteUserContacts_id2(idu);
				  		}
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("", false);
				})

		},


		// cancella tutti i contatti dell utente idu in cui compare come id2
		deleteUserContacts_id2: function(idu){
			console.log("deleteUserContacts ", idu);
			var THIS = this;
			BaasBox.loadCollectionWithParams("Contatto", {where: "id2='"+idu+"'"})
			  .done(function(res) {
			  		console.log(res);
			  		var c =1;
			  		if(res.length==0) THIS.suspendAccount(idu);
			  		else
			  			{
				  		for(var i=0; i<res.length; i++){
				  			BaasBox.deleteObject(res[i].id, "Contatto")
								  .done(function(result) {
								  	if(c==res.length){
								  		
								  		c++;
								  	}
								  })
								  .fail(function(error) {
								    console.log("error ", error);
								  })
				  			}
				  		THIS.suspendAccount(idu);
				  		}
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("", false);
				})

		},



		saveImage: function(idu, data_url){
			var THIS=this
			BaasBox.loadCollectionWithParams("Utente", {where: "username='"+idu+"'"})
			  .done(function(res) {
			  		console.log("res loadCollection saveImg")
			  		console.log(res);
				  	BaasBox.updateField(res[0].id, "Utente", "image", data_url)
					.done(function(res1) {
						console.log("res ", res1);
						localStorage.setItem("imageLogged",data_url);
						THIS.trigger("resultSaveImage", true);
					})
					.fail(function(error) {
					   	console.log("error ", error);
					    THIS.trigger("errorSaveNome", false);
					})


			  })
			  .fail(function(error) {
			  	console.log("error ", error);
			  })		
			
		},


		//passando username e password come parametro devo controllare che compaino nella collezione Utente
		login: function(username, password){
			console.log("login da",username, password);
			var us = username.toLowerCase();
			var THIS = this;
			BaasBox.login(us, password)
				.done(function (user) {
					console.log("User Login done", user);
					THIS.loadData(us, password);
				})
				.fail(function (err) {
					console.log("error ", err);
					THIS.trigger("resultLogin", null);

				})
		},

		loadData: function(username, password){
			var THIS = this;	
			var trovato = false;
			BaasBox.loadCollection("Utente")
				.done(function(res) {
				    console.log("Risultatto loadCollection Utente: ", res);
				    for (var i=0; i<res.length; i++){
				    	//vedere se true deve essere una stringa o va bene booleano -> se si, cambiare nel database
	            		if( res[i].username == username ){
	            			localStorage.setItem('idu',res[i].id);  //salvare nel localstorage -> res[i].id
	            			localStorage.setItem('nameLogged',res[i].nome);
	            			localStorage.setItem('surnameLogged',res[i].cognome);
	            			localStorage.setItem('usernameLogged',res[i].username);
	            			localStorage.setItem('passwordLogged',res[i].password);
	            			localStorage.setItem("emailLogged", res[i].mail);
	            			localStorage.setItem("imageLogged", res[i].image);
	            			THIS.trigger("resultLogin",res[i]);
	            			trovato=true;
	            			break;
	              		}
		            }
		            if(trovato==false){
        				THIS.trigger("resultLogin",null);	
       				}	  
				})
				.fail(function(error) {
			    	console.log("error ", error);
				})
		},

		logout: function(){
			var THIS = this;
			BaasBox.logout()
				  .done(function (res) {
				    console.log("logout done");
				    THIS.trigger("baasboxLogout", true);
				  })
				  .fail(function (error) {
				    console.log("error ", error);
  })
		},

		//conta le bacheche di cui l'utente con id=idu fa parte
    	//CONTROLLARE
    	contaBacheche: function(){
			var THIS=this;
			BaasBox.loadCollectionWithParams("Bacheca_Utente", {where: "idu='"+localStorage.getItem('idu')+"'" })
				.done(function(res) {
					console.log("res contaBachecheUtente ", res.length);
					THIS.trigger("eventoContaBachecheUtente", res.length);
				})
				.fail(function(error) {
					console.log("error ", error);
					THIS.trigger("errorContaBacheche", false);
				})
    	},

    	caricaDati: function(){
    		var THIS = this;
    		BaasBox.fetchUserProfile(localStorage.getItem("usernameLogged"))
			  .done(function(res) {
			  	THIS.trigger("datiUtente", res['data']);
			  })
			  .fail(function(error) {
			    console.log("error ", error);
			  })
    	},

    	changePasswordBaasbox: function(oldPass, newPass){
    		var THIS = this;
    		BaasBox.changePassword(oldPass, newPass)
				.done(function(res) {
					console.log("result changePasswordBaasbox ", res);
					THIS.trigger("changePasswordDone", newPass);
				})
				.fail(function(error) {
					THIS.trigger("changePasswordDone", 0);
				})
    	},

    	//che fa que??????????????? da unauthorized a queste informazioni
		checkUsername: function(name, surname, username, email, password ){
			var post = new Object();

			post.name = name;
			post.surname = surname;
			post.username = username;
			post.email = email;
			post.password = password;
			var exist = false;
			var THIS = this;
    		BaasBox.loadCollection("Utente")	             
				.done(function(res) {
					for(var i=0; i<res.length; i++){
						if(res[i].username == username){
							exist = true;
							THIS.trigger("resultUsername", true);
							break;
						}
					}

					if(exist==false){
						THIS.trigger("resultUsername", post);
					}
				})
				.fail(function(error) {
					console.log("error ", error);
				})
		},


		//aggiunge una nuova riga alla collezione "Utente"
		register: function(nome, cognome, username, mail, password){
			var THIS = this;
			//{"visibleByRegisteredUsers": {"mail": mail , "nome": nome, "cognome": cognome}}
			var us = username.toLowerCase();
			BaasBox.signup(us, password, {"visibleByTheUser": {"email" : mail}})
				.done(function (res) {
					console.log("signup ", res);
					THIS.registerData(nome, cognome, us, mail, password);

				})
				.fail(function (error) {
					THIS.trigger("eventoRegister", false);
					console.log("error ", error);
				})

		},

		registerData: function(nome, cognome, username, mail, password){
			var post = new Object();

			post.nome = nome;
			post.cognome = cognome;
			post.username = username;
			post.mail = mail;
			post.password = password;
			var im = "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" ;
			post.image = im;
			var exist = false;
			var THIS=this
			
			BaasBox.save(post, "Utente")
						.done(function(res) {
							console.log("res registerData ", res);
							THIS.setPermission(res);
						})
						.fail(function(error) {
							console.log("inserimentoError ", error);
							THIS.trigger("eventoRegister ", false); //in caso la registrazione non è andata bene ritorna 0
						})			
				
		},

		setPermission: function(result){
			var THIS = this;
			console.log("result", result, result.id);
			BaasBox.grantRoleAccessToObject("Utente",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			    console.log("res ", res);
			    THIS.trigger("eventoRegister ", result); //se la registrazione è andata bene torna res con i dati
			  })
			  .fail(function(error) {
			    console.log("eventoRegister", false);
			  })
		},
		//chiamare quando la funzione di sopra torna true
		inviaMail: function(nome, cognome, username, mail, password){
			var THIS = this;
			var jqXHR = $.ajax({

				url: "http://siwyt.altervista.org/sendMail.php", //percorso script php che invia
				data: {
					nome : nome,
					cognome : cognome,
					email : mail,
					username : username,
					pass : password
					
				},
				type: 'POST',
				dataType: 'json',
				async: false
			});
			console.log(jqXHR.responseText);
			THIS.trigger("mailSent ", true);

		},

		// invia una mail che invita all indirizzo specificato a iscriversi a siwyt
		inviaMailInvito: function(nome, cognome, mail){
			var THIS = this;
			var jqXHR = $.ajax({

				url: "http://siwyt.altervista.org/sendInviteMail.php", //percorso script php che invia
				data: {
					nome : nome,
					cognome : cognome,
					mail: mail
					
				},
				type: 'POST',
				dataType: 'json',
				async: false
			});
			//console.log(jqXHR.responseText);
			THIS.trigger("mailSent ", true);

		},

		inviaMailContattoAggiunto: function(nome, cognome,mail){
			var THIS = this;
			var jqXHR = $.ajax({

				url: "http://siwyt.altervista.org/sendMailContact.php", //percorso script php che invia
				data: {
					nome : nome,
					cognome : cognome,
					mail: mail
					
				},
				type: 'POST',
				dataType: 'json',
				async: false
			});
			//console.log(jqXHR.responseText);
			THIS.trigger("mailSent ", true);
		},

		inviaMailAggiuntoBacheca: function(nome, cognome, mail, bacheca){
			var THIS = this;
			var jqXHR = $.ajax({

				url: "http://siwyt.altervista.org/sendMailAddToBoard.php", //percorso script php che invia
				data: {
					nome : nome,
					cognome : cognome,
					mail: mail,
					bacheca: bacheca
					
				},
				type: 'POST',
				dataType: 'json',
				async: false
			});
			//console.log(jqXHR.responseText);
			THIS.trigger("mailSent ", true);
		},


		//funzione che cambia il nome dell'utente con id idu
		saveName: function(idu, name){
		var THIS = this;
			BaasBox.updateField(idu, "Utente", "nome", name)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveNome", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveNome", false);
				})
		},

		//funzione che cambia cognome dell'utente con id idu
		saveSurname: function(idu, surname){
			var THIS = this;
			BaasBox.updateField(idu, "Utente", "cognome", surname)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveCognome", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveCognome", false);
				})
		},


		//funzione che cambia email dell'utente con id idu
		saveEmail: function(idu, email){
			var THIS = this;
			BaasBox.updateField(idu, "Utente", "mail", email)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoSaveEmail", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveEmail", false);
				})
		},

		// funzione che cambia la password dell utente con id idu
		changePassword: function(idu, password){
			var THIS = this;
			console.log(idu);
			console.log(name);
			var c=0;
			BaasBox.updateField(idu, "Utente", "password", password)
				.done(function(res) {
					console.log("res ", res);
					console.log("password changed");
					THIS.trigger("passwordChanged", true);
									})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errormodificaTitolo", false);
				})
		},

		//1 - utente.cercaUtente(str) la funzione prende in input una stringa str e 
   		//restituisce un array contenente oggetti utente i cui nome o cognome contengono str
   		cercaUtente: function(str){
   			var THIS = this;	
			var trovato = false;
			var a = new Array();
			var c = 0;
   			BaasBox.loadCollection("Utente")
   				.done(function(res) {
   					console.log("load search done", res);
				    for (var i=0; i<res.length; i++){
				    	var nome = (res[i].nome).toLowerCase();
				    	var cognome = (res[i].cognome).toLowerCase();
				    	if((nome.indexOf(str.toLowerCase()))>=0 || (cognome.indexOf(str.toLowerCase()))>=0) {
				    		a[c] = res[i];
				    		c++;
				    	}
				    		

				    	}
				    	if(a.length>0) THIS.filtraRisultati(a);
				    	else THIS.trigger("resultCercaUtente", false);
				    
				})
				.fail(function(error) {
			    	console.log("error ", error);
				})
   		},

   		recoverPass: function(user){
   			console.log(user);
   			BaasBox.resetPasswordWithParam(user);
   		},

   	/*	cercaUtente2: function(str){
   			var THS = this;
   			BaasBox.fetchUsers()
			  .done(function(res) {
			    console.log("res ", res['data']);
			    for (var i=0; i<res.length; i++){
				    	var nome = (res[i].nome).toLowerCase();
				    	var cognome = (res[i].cognome).toLowerCase();
				    	if((nome.includes(str.toLowerCase())) || (cognome.includes(str.toLowerCase()))) {
				    		a[c] = res[i];
				    		c++;
				    	}
				    		

				    	}
				    	if(a.length>0) THIS.filtraRisultati(a);
				    	else THIS.trigger("resultCercaUtente", []);
			  })
			  .fail(function(error) {
			    console.log("error ", error);
  			})
   		},*/

   		// funzione che filtra i risultati di ricerca in modo da non visalizzare gli utenti che sono già stati aggiunti ai contatti
   		filtraRisultati: function(a){
   			var exist = false;
   			var c = new Array();
   			var k =0;
   			var THIS = this;
   			var idu = localStorage.getItem("idu");
   			BaasBox.loadCollection("Contatto")
   				.done(function(res) {
   					for (var i=0; i<a.length; i++){
   						exist = false;
   						console.log(a[i].id);
   						if(a[i].id==idu) exist =true;
   						else{
	   						for( var j=0; j< res.length; j++){
	   							if((a[i].id == res[j].id1 && res[j].id2==idu) || (a[i].id == res[j].id2 && res[j].id1==idu)) {
	   								exist = true;
	   							}
	   						}


   						}
   						if(!exist) c[k++]=a[i];
   						else console.log("contatto presente");
   					}
   					
   					if(c.length>0) {
   						console.log(c);
   						THIS.trigger("resultCercaUtente", c);
   					}else{
   						THIS.trigger("resultCercaUtente", []);
   						console.log("nessun utente trovato");
   					}


   				})
   				.fail(function(error) {
			    	console.log("error filtraRisultati", error);
				})
   					
   		},


		//rimuove un 'Utente' con id=idu dalla tabella utente
   		rimuoviUtente: function(idu){
   			BaasBox.deleteObject(idu, "Utente")
				.done(function(res) {
					console.log("res ", res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		}
						

	});

	return Utente;
});

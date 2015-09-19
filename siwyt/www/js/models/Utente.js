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

		deleteAccount: function(e){
			console.log("account deleted");
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
			BaasBox.signup(us, password)
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
			post.image = "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";
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

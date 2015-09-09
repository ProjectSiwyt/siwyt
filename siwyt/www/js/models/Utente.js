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

		//passando username e password come parametro devo controllare che compaino nella collezione Utente
		login: function(username, password){
			console.log("login da",username, password);
			var THIS = this;
			BaasBox.login(username, password)
				.done(function (user) {
					console.log("User Login done", user);
					THIS.loadData(username, password);
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
	            			//localStorage.setItem('passwordLogged',res[i].password);
	            			localStorage.setItem("emailLogged", res[i].mail);
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
			BaasBox.signup(username, password)
				.done(function (res) {
					console.log("signup ", res);
					THIS.registerData(nome, cognome, username, mail, password);

				})
				.fail(function (error) {
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
			var exist = false;
			var THIS=this
			
			BaasBox.save(post, "Utente")
						.done(function(res) {
							console.log("res registerData ", res);
							THIS.setPermission(res);
						})
						.fail(function(error) {
							console.log("inserimentoError ", error);
							THIS.trigger("inserimentoError ", 0); //in caso la registrazione non è andata bene ritorna 0
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
			    console.log("error permission", error);
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
				    	if((nome.includes(str.toLowerCase())) || (cognome.includes(str.toLowerCase()))) {
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
   						for( var j=0; j< res.length; j++){
   							if((a[i].id == res[j].id1 && res[j].id2==idu) || (a[i].id == res[j].id2 && res[j].id1==idu) || (a[i].id==idu)){
   								exist = true;
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

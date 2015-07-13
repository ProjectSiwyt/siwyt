define(function(require) {

	var Backbone = require("backbone");

	var Utente = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			nome: "Not specified",
			cognome: "Not specified",
			mail: "Not specified",
			username: "Not specified",
			password: "Not specified",
			confermato: "false"
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
			console.log(idu);

			var THIS = this;	
	    	BaasBox.loadCollection("Contatto")
	       	
	       	.done(function(res) {
	         	console.log("res ", res);

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
	           	console.log(a);
	           	//debugger;
	           	
			   	BaasBox.loadCollection("Utente")	             
			   	
			   	.done(function(res2) {
			   		
			   		var a2= new Array();
			   		//var ca=0;
			   		var c2=0;
			       	for(var i=0; i<a.length; i++){
			       		console.log("asddddfasdf");
			       		for(var j=0; j<res2.length; j++){

			       			if(res2[j].id == a[i]){
			       				console.log(res2[j].nome);
			       				a2[c2++] = res2[j];	
			       			}
			       		}
			       	}
			       	console.log(a2);
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
			var THIS = this;	
			var trovato = false;
			BaasBox.loadCollection("Utente")
				.done(function(res) {
				    console.log("res ", res);
				    for (var i=0; i<res.length; i++){
				    	//vedere se true deve essere una stringa o va bene booleano -> se si, cambiare nel database
	            		if( res[i].username == username && res[i].password == password ){//&& res[i].confermato == true){
	            			localStorage.setItem('idu',res[i].id);  //salvare nel localstorage -> res[i].id
	            			localStorage.setItem('nameLogged',res[i].nome);
	            			localStorage.setItem('surnameLogged',res[i].cognome);
	            			localStorage.setItem('usernameLogged',res[i].username);
	            			localStorage.setItem('passwordLogged',res[i].password);
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
							console.log("res ", res);
							THIS.trigger("eventoRegister ", res); //se la registrazione è andata bene torna res con i dati
						})
						.fail(function(error) {
							console.log("inserimentoError ", error);
							THIS.trigger("inserimentoError ", 0); //in caso la registrazione non è andata bene ritorna 0
						})			
				
		},
		//chiamare quando la funzione di sopra torna true
		inviaMail: function(nome, cognome, username, mail, password){

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
		},


		//funzione per la modifica della password?!
		saveData: function(idUtente, name, surname, newPass){
			console.log("saving data");
		},


		//che è?!?!
		checkPassword: function(idUtente , password){
			console.log("check password ");
			return true;
		}

	});

	return Utente;
});

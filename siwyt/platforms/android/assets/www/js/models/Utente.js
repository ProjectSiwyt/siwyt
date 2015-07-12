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

		register: function(name, surname, username, email, password){
			//console.log(email);
			console.log("account registred");
		},

		checkUsername: function(username){
			console.log("username valid: "+ username);
			return true;
		},
			
		//controllo se esiste un utente che ha come username e password quelli passati come parametro
		//in caso positivo vengono restituiti i dati dell'utente altrimenti null
		login: function(username, password){
		var THIS = this;	
		BaasBox.loadCollection("Utente")
		 	.done(function(res) {
		 		var trovato=false;
		   		console.log("res ", res);
		   		for (var i=0; i<res.length; i++){
		           	if( res[i].username == username && res[i].password == password ){
		            localStorage.setItem('idu',res[i].id);  //salvare nel localstorage -> res[i].id
		            THIS.trigger("resultLogin",res[i]);
		           	trovato = true;
		           	break;
		        	}
		        }
		        if(trovato==false){
		        	THIS.trigger("resultLogin",null);	
		        }	           
		 	})
			 .fail(function(error) {
			   console.log("error", error);
			 })
		},

		logout: function(idUtente){
			console.log("logout");
		},

		saveData: function(idUtente, name, surname, newPass){
			console.log(surname);
			console.log("saving data");
		},

		checkPassword: function(idUtente , password){
			idUtente = this.id;
			console.log("check password "+idUtente +" , password: "+password);
			return true;
		}

	});

	return Utente;
});

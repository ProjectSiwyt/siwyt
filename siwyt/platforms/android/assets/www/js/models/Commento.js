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
		elencoCommentiPostit: function(idp){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Commento", {where: "idp='"+idp+"'" })
				.done(function(res) {
					console.log("res ", res);

					THIS.trigger("elencoCommenti", res);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
		},
		//aggiunge una nuova riga alla collezione Commento
		aggiungiCommento: function(idp, contenuto, idu){

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
					THIS.setPermissionAggiungiCommento(res);
				})
				.fail(function(error) {
					THIS.trigger("error", error);
				})
		},

		setPermissionAggiungiCommento: function(result){
			var THIS = this;
			console.log("result setPermissionAggiungiCommento", result, result.id);
			BaasBox.grantRoleAccessToObject("Commento",result.id, BaasBox.ALL_PERMISSION, BaasBox.REGISTERED_ROLE)
			  .done(function(res) {
			    console.log(" setPermissionAggiungiCommento ", res);
			    THIS.trigger("aggiuntoCommento", result);
			  })
			  .fail(function(error) {
			    console.log("error setPermissionAggiungiCommento", error);
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
   		},
   		//restituisce il nome dell'autore del commento
   		nomeaAutore: function(idu){ 
        var THIS = this; 
         
            BaasBox.loadCollectionWithParams("Utente", {where: "id='"+idu+"'" }) 
                .done(function(res) { 
                    console.log("res ", res); 
 
                    //THIS.trigger("eventoNomeAutore ", res.nome); 
                }) 
                .fail(function(error) { 
                    console.log("errorElencopostits ", error); 
                }) 
        },
         	//restituisci i nomi degli autori dei commenti 
        nomeAutori: function(r){ 
        console.log(r);
        var THIS = this; 
        var c=0;
        var a=new Array();
         	for(var i=0; i<r.length; i++){
		        BaasBox.loadCollectionWithParams("Utente", {where: "id='"+r[i].idu+"'" }) 
		            .done(function(res) {
		            	var o =new Object();
		            	o.id=res[0].id;
		            	o.username=res[0].username;
		            	a[c]=o;
		            	c++;
		                if(c==r.length) {
		                	THIS.trigger("eventoNomiAutori", a); 
		                }   
		            }) 
		            .fail(function(error) { 
		                console.log("error ", error); 
		            }) 
	        }
        },
         //Per la funzione rimuoviPostit devo fare prima una query che mi ritorna un array contenente le righe da eliminare

       idRigheCommenti: function(idp){
        var a= new Array();
				var c =0;
				var THIS=this;
        BaasBox.loadCollection("Commento") 
            .done(function(res) { 
                for(var j=0; j<res.length; j++){ 
                    if(idp == res[j].idp){ 
                        a[c++]=res[j]; 
                    }
                } 
                if(a.length!=0){
	                THIS.rimuoviCommenti(a,idp);	
                }
                else{
                	THIS.trigger("rimuoviCommenti", true);
                }
            }) 
            .fail(function(error) { 
                console.log("error ", error); 
            }) 
       },

     
       //rimuove dalla tabella 'Postit' l'elenco dei postit passati nell'array passato come parametro 
       rimuoviCommenti: function(r,idp){
       	console.log(r);
       	var THIS=this;
       	var c=0;
        for(var i=0; i<r.length; i++){ 
               BaasBox.deleteObject(r[i].id, "Commento") 
                .done(function(res) {
                	c++; 
                	if (c==r.length){
                		console.log("eliminato");
                		THIS.trigger("rimuoviCommenti", idp); 
                	}
                }) 
                .fail(function(error) { 
                    console.log("error ", error); 
                })
        } 
       },

	});

	return Commento;
});

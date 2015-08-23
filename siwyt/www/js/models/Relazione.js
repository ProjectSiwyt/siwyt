define(function(require) {

	var Backbone = require("backbone");

	var Relazione = Backbone.Model.extend({
		defaults: {
			id: "",
			idb: "",
			idp1: "",
			idp2: "",
			etichetta: ""
		},

		constructorName: "Relazione",

		elencoRelazioniBacheca: function(idb){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Relazione", {where: "idb='"+idb+"'" })
				.done(function(res) {
					THIS.trigger("elencorelazioni ", res);
				})
				.fail(function(error) {
					console.log("errorElencopostits ", error);
				})
		},

		//aggiunge una nuova riga alla collezione Relazione
		aggiungiRelazione: function(idb, idp1, idp2, etichetta ){

			var THIS = this;
			
			var post = new Object();
			post.idb=idb;
			post.idp1 = idp1;
			post.idp2 = idp2;
			post.etichetta = etichetta;
			
			BaasBox.save(post, "Relazione")
				.done(function(res) {
					console.log("res");
					THIS.trigger("eventoAggiungiRelazione", res);
				})
				.fail(function(error) {
					console.log("errore");
				})
		},

		//funzione che cambia l'etichetta della 'Relazione' con id idr
		modificaEtichetta: function(idr, etichetta){
		var THIS = this;
			BaasBox.updateField(idr, "Relazione", "etichetta", etichetta)
				.done(function(res) {
					console.log("res ", res);
					THIS.trigger("eventoModificaEtichetta", true);
				})
				.fail(function(error) {
				   	console.log("error ");
				    THIS.trigger("errorModificaEtichetta", false);
				})
		},

		//funzione che cambia la posizione della 'Relazione' con id idr
		modificaPosizione: function(idr, xp1, yp1, xp2, yp2){
		var THIS = this;
			BaasBox.updateField(idr, "Relazione", "xp1", xp1, "yp1", yp1, "xp2", xp2, "yp2", yp2)
				.done(function(res) {
					console.log("res ", res);
					//THIS.trigger("eventoModificaPosizione", true);
				})
				.fail(function(error) {
				   	console.log("error ");
				    THIS.trigger("errorModificaPosizione", false);
				})
		},

		//rimuove dalla tabella 'Relazione' le relazioni con il postit eliminato
   		rimuoviRelazioniPostit: function(idp){
   			var a= new Array();
   			var c=0;
   			var THIS=this;
   			BaasBox.loadCollection("Relazione")
   				.done(function(res){
   					for(var i=0; i<res.length;i++){
   						if (res[i].idp1==idp || res[i].idp2==idp){
   							a[c++]=res[i];
   						}
   					}
   					if (a.length!=0){
   						THIS.rimuoviRelPostit(a);
   					}
   					else{
   						THIS.trigger("eliminateRelazioniPostit",a);
   					}
   				})
   				.fail(function(error){
   					console.log("error");
   				})
   			
   		},
   		rimuoviRelPostit: function(a){
   			var c=0;
   			var THIS=this
   			for (var i=0; i<a.length;i++){
   				BaasBox.deleteObject(a[i].id, "Relazione")
					.done(function(res) {
						c++;
						if(c==a.length){
							THIS.trigger("eliminateRelazioniPostit", a);
						}
					})
					.fail(function(error) {
						console.log("error ");
					})
   			}
   		},

   		//Per la funzione rimuoviRelazioni devo fare prima una query che mi ritorna un array contenente le righe da eliminare

       idRigheRelazioni: function(idb){
        var a= new Array();
		var c =0;
		var THIS=this;
        BaasBox.loadCollection("Relazione") 
            .done(function(res) { 
                for(var j=0; j<res.length; j++){ 
                    if(idb == res[j].idb){ 
                        a[c++]=res[j]; 
                    }
                } 
                THIS.rimuoviRelazioni(a);
            }) 
            .fail(function(error) { 
                console.log("error "); 
            }) 
       },
       rimuoviRelazione: function(id){
       		var THIS=this;
       		BaasBox.deleteObject(id,"Relazione")
       			.done(function(res){
       				THIS.trigger("rimuoviRelazione",id);
       			})
       			.fail(function(error){
       				console.log("error");
       			})
       },
     
       //rimuove dalla tabella 'Postit' l'elenco dei postit passati nell'array passato come parametro 
       rimuoviRelazioni: function(r){
       	console.log(r);
       	var THIS=this;
       	var c=0;
        for(var i=0; i<r.length; i++){ 
               BaasBox.deleteObject(r[i].id, "Relazione") 
                .done(function(res) {
                	c++; 
                	if (c==r.length){
                		THIS.trigger("rimuoviRelazioni", r); 
                	}
                }) 
                .fail(function(error) { 
                    console.log("error "); 
                })
        } 
       },


	});

	return Relazione;
});

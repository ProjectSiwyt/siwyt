define(function(require) {

	var Backbone = require("backbone");

	var Postit = Backbone.Model.extend({
		defaults: {
			id: "Not specified",
			idb: "",
			contenuto: "Not specified",
			idu: "",
			data: "Not specified",
			ora: "Not specified",
			altezza: "",
			larghezza: "",
			x: "",
			y: "",
			colore:"",
			font:""

		},
		constructorName: "Postit",

		postitData: function(idp){
    		var THIS=this;
			BaasBox.loadCollectionWithParams("Postit", {where: "id='"+idp+"'" })
			 .done(function(res) {
			 	THIS.trigger("datiPostit", res);
			 })
			 .fail(function(error) {
			 	THIS.trigger("error",error);
			 })
		},
		//restituisci i postit della bacheca con id uguale a quello passato come parametro
		elencoPostitBacheca: function(idb){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Postit", {where: "idb='"+idb+"'" })
				.done(function(res) {
					THIS.trigger("elencopostits ", res);
				})
				.fail(function(error) {
					console.log("errorElencopostits ", error);
				})
		},

		//restituisci i postit della bacheca con id uguale a quello passato come parametro
		elencoPostitUtente: function(idu){
		var THIS = this;
		
			BaasBox.loadCollectionWithParams("Postit", {where: "idu='"+idu+"'" })
				.done(function(res) {
					THIS.trigger("eventoElencoPostitUtente ", res);
				})
				.fail(function(error) {
					console.log("errorElencopostits ", error);
				})
		},


		//aggiunge una nuova riga alla collezione Postit
		aggiungiPostit: function(idb, contenuto, idu, altezza, larghezza, x, y, colore, font, dimensione){

			var THIS = this;

			var d = new Date();
			var data = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
			var ora = d.getHours() + ":" + d.getMinutes();

			var post = new Object();
			post.idb = idb;
			post.contenuto = contenuto;
			post.idu = idu;
			post.data = data;
			post.ora = ora;
			post.altezza = altezza;
			post.larghezza = larghezza;
			post.x = x;
			post.y = y;
			post.colore = colore;
			post.font = font;
			post.dimensione=dimensione;

			BaasBox.save(post, "Postit")
				.done(function(res) {
					THIS.trigger("eventoAggiungiPostit", res);
				})
				.fail(function(error) {
					THIS.trigger("errorAggiungiPostit", error);
				})
		},

		//funzione che cambia il contenuto del postit con id idp
		saveContenuto: function(idp, contenuto){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "contenuto", contenuto)
				.done(function(res) {
					THIS.trigger("eventoSaveContenuto", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveContenuto", false);
				})
		},
		//funzione che cambia il contenuto del postit con id idp
		saveXY: function(idp, x, y){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "x", x)
				.done(function(res) {
					THIS.saveY(idp,y);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("error", error);
				})
		},
		saveY: function(idp,y){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "y", y)
				.done(function(res) {
					THIS.trigger("eventoSaveXY", res);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("error", error);
				})
		},
		//funzione che cambia il contenuto del postit con id idp
		saveHW: function(idp, h,w){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "altezza", h)
				.done(function(res) {
					THIS.saveW(idp,w);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("error", error);
				})
		},
		saveW: function(idp,w){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "larghezza", w)
				.done(function(res) {
					THIS.tigger("eventoSaveHW", res);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("error", error);
				})
		},

		//funzione che cambia la data del postit con id idp
		saveData: function(idp, data){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "data", data)
				.done(function(res) {
					THIS.trigger("eventoSaveData", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveData", false);
				})
		},

		//funzione che cambia l'ora del postit con id idp
		saveOra: function(idp, ora){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "ora", ora)
				.done(function(res) {
					THIS.trigger("eventoSaveOra", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveOra", false);
				})
		},
		saveColore: function(idp, colore){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "colore", colore)
				.done(function(res) {					
					THIS.trigger("eventoSaveColore", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveColore", false);
				})
		},
		saveFont: function(idp, font){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "font", font)
				.done(function(res) {					
					THIS.trigger("eventoSaveFont", true);
				})
				.fail(function(error) {
				   	console.log("error ", error);
				    THIS.trigger("errorSaveFont", false);
				})
		},
		saveDimensionFont: function(idp, font){
			var THIS = this;
			BaasBox.updateField(idp, "Postit", "dimensione", font)
				.done(function(res) {					
					THIS.trigger("eventoSaveDimensionFont", true);
				})
				.fail(function(error) {
				    THIS.trigger("errorSaveFont", false);
				})
		},
		//rimuove dalla tabella 'Postit' la riga con id idp
   		rimuoviPostit: function(idp){
   			var THIS=this;
   			BaasBox.deleteObject(idp, "Postit")
				.done(function(res) {
					THIS.trigger("rimuoviPostit", idp);
				})
				.fail(function(error) {
					console.log("error ", error);
				})
   		},

		 //Per la funzione rimuoviPostit devo fare prima una query che mi ritorna un array contenente le righe da eliminare

       idRighePostit: function(idb){
        var a= new Array();
				var c =0;
				var THIS=this;
        BaasBox.loadCollection("Postit") 
            .done(function(res) { 
                for(var j=0; j<res.length; j++){ 
                    if(idb == res[j].idb){ 
                        a[c++]=res[j]; 
                    }
                } 
                if(a.length!=0){
                	THIS.rimuoviPostits(a);
                }
                else{
                	THIS.trigger("rimuoviPostits",a);
                }
            }) 
            .fail(function(error) { 
                console.log("error ", error); 
            }) 
       },

     
       //rimuove dalla tabella 'Postit' l'elenco dei postit passati nell'array passato come parametro 
       rimuoviPostits: function(r){
       	console.log(r);
       	var THIS=this;
       	var c=0;
        for(var i=0; i<r.length; i++){ 
               BaasBox.deleteObject(r[i].id, "Postit") 
                .done(function(res) {
                	c++; 
                	if (c==r.length){
                		THIS.trigger("rimuoviPostits", r); 
                	}
                }) 
                .fail(function(error) { 
                    console.log("error ", error); 
                })
        } 
       },

   		 //restituisci il nome dell'autore del postit 
        nomeAutore: function(idu){ 
        var THIS = this; 
         
            BaasBox.loadCollectionWithParams("Utente", {where: "id='"+idu+"'" }) 
                .done(function(res) { 
 
                    THIS.trigger("datiAutore", res[0].username); 
                }) 
                .fail(function(error) { 
                    console.log("errorElencopostits ", error); 
                }) 
        },
       	//restituisci i nomi degli autori di postit 
        nomeAutori: function(r){ 
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
        }
		

	});

	return Postit;
});


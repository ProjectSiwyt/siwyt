define(function(require) {

    var Backbone = require("backbone");
    var Bacheca = require("models/Bacheca");
    var Utils = require("utils");
    var Postit = require("models/Postit");
    var Postits = require("collections/Postits");
    var Baasbox = require("baasbox");
    var ShowPostitsNoticeboard = require("views/pages/ShowPostitsNoticeboard");

    var Bacheche = require("collections/Bacheche");

    var BachecaHome = Utils.Page.extend({

        constructorName: "BachecaHome",

        model: Bacheca,

        initialize: function(idb) {
            this.idb = idb;
            // load the precompiled template
            this.template = Utils.templates.structureBoard;

            document.getElementById("header").classList.add('hide');
            document.getElementById("navigation").classList.add('hide');
            //document.getElementById("queryError").classList.add("hide");
            spinner.stop();

            this.bacheca = new Bacheca();
            this.postits = new Postit();

            //Mi metto in ascolto dell'evento che mi ritorna i dati di una bacheca
            this.bacheca.on("datiBacheca", this.appendTitle, this);
            //Mi metto in ascolto di eventuali errori nel caricamento/salvataggio dei dati
            this.bacheca.on("error", this.error);

            //Mi metto in ascolto dell'evento che mi ritorna i postits di una bacheca
            this.postits.on("elencopostits", this.appendItems, this);
            //Mi metto in ascolto di eventuali errori nel caricamento/salvataggio dei dati
            this.postits.on("error", this.error);

            //chiama la funzion che calcola i dati che restituisce i dati della bacheca con id idb
            this.bacheca.noticeboardData(idb);

        },

        id: "bachecahome",
        className: "i-g page",
        postit: 1,
       

        //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
        events: {
            "tap #aprimenu": "gestionemenu",
            "tap #addPostit": "addPostit",
            "tap #goToHome": "goToHome",
            "tap #boardManagement": "goToBoardManagement",
            "tap #newPostit": "addPostit",
            "tap .postit": "goToComments",            
            "tap #backBoard": "goBack", 
            "tap .rename": "rename"       
        },
        goBack: function() {
            window.history.back();
        },
        error: function() {
            //document.getElementById("queryError").classList.remove('hide');
        },

        //chiama la funzione che calcola i dati dei postits della bacheca
        getPostits: function(idb) {
            this.postits.elencoPostitBacheca(idb);
        },
        //inserisce il titolo della bacheca nella pagina
        appendTitle: function(result) {
            console.log(result[0].nome);
            document.getElementById("titleBacheca").innerHTML = result[0].nome;

            //chiamo la funzione per prendere i postit
            this.getPostits(result[0].id);
        },
        appendItems: function(result) {
            console.log(result);
            var b = new Postits();
            for (var i = 0; i < result.length; i++) {
                b.add(result[i]);
                console.log(result[i]);
            }
            this.subView = (new ShowPostitsNoticeboard({
                collection: b
            })).render().el;
            console.log(this.subView);
            //quando i dati vengono caricati faccio la render della pagina contenente la lista delle bacheche
            //$('#boardContent').append(this.subView);
            document.getElementById("boardContent").appendChild(this.subView);
        },
        render: function() {
            $(this.el).html(this.template());
            return this;
        },

        goToMap: function(e) {
            Backbone.history.navigate("map", {
                trigger: true
            });
        },
        gestionemenu: function(e) {
            var menu = document.getElementById("contenutoBacheca");

            if (menu.classList.contains('open')) {
                menu.classList.remove('open');
                menu.classList.add('close');
            } else {
                menu.classList.remove('close');
                menu.classList.add('open');
            }
        },        

        addPostit: function(e) {
            this.createPostit(e);
            //Rinomina Postit
           
            //Gestione Salvataggio postit
        },
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        createPostit: function(e) {
            var boardContent = document.getElementById("boardContent");
          //Creazione postit
            var postit = document.createElement("div");
            postit.id="postit"+this.postit;
            postit.style.left = (this.postit * 10)+"px";
            postit.style.top = (this.postit * 10) + 50+"px";            
            var h3 = document.createElement("h3");
            var autore = document.createElement("div");
            var data = document.createElement("div");
            var link = document.createElement("a");
            var pencil = document.createElement("i");
            h3.classList.add("postit-title");
            h3.innerHTML = "Postit"+this.postit;
            autore.classList.add("pull-left", "caption");
            autore.innerHTML = localStorage.getItem("nameLogged");
            data.classList.add("pull-right", "caption");
            data.innerHTML = "data";
            link.classList.add("popupLink");
            pencil.classList.add("fa", "fa-pencil");
            link.appendChild(pencil);
            postit.appendChild(h3);
            postit.appendChild(autore);
            postit.appendChild(data);
            postit.appendChild(link);
            postit.classList.add("postit", "moveable", "block", "absolute", "center");
            boardContent.appendChild(postit);                        
            // Fine creazione postit
            // Creazione dialog per il rename e per il popup
            var layerDialog = document.createElement("div");
            layerDialog.id="postit"+this.postit+"RenameScreen";
            layerDialog.classList.add("popup-screen","overlay","in","hide");
            var dialog = document.createElement("div");
            dialog.id="postit"+this.postit+"RenamePopup";
            dialog.classList.add("postit-popup","popup-container","hide");
            var textarea = document.createElement("textarea");
            var submit = document.createElement("input");
            submit.type="submit";
            submit.value="Done";
            submit.classList.add("rename");
            dialog.appendChild(textarea);
            dialog.appendChild(submit);
            boardContent.appendChild(layerDialog);
            boardContent.appendChild(dialog);
            this.showDialog(e);            
        },
        
        showDialog:function(e){
          var obj = e.currentTarget;
          if(obj.id == "addPostit" || obj.id == "newPostit" || obj.parentNode.id=="postit"+this.postit+"RenamePopup"){
            var popScreen = document.getElementById("postit"+this.postit+"RenameScreen");
            var popPopup = document.getElementById("postit"+this.postit+"RenamePopup");
            popScreen.classList.toggle('hide');
            popPopup.classList.toggle('hide');
          }
        },
        rename:function(e){
            console.log("rename");
            var obj = e.currentTarget.parentNode;
            if(obj.id == "postit"+this.postit+"RenamePopup"){
                var postit=document.getElementById("postit"+this.postit);
                if(obj.firstChild.value != ""){
                    postit.firstChild.innerHTML = obj.firstChild.value;
                }
                this.showDialog(e);
            }
            this.postit++;
        },
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        goToHome: function(e) {
            Backbone.history.navigate("homeSiwyt", {
                trigger: true
            });
            document.getElementById("header").style.display = 'block';
        },
        goToComments: function(e) {
            alert("goToComments");
        },
        goToBoardManagement: function(e) {
            console.log(this.idb);
            Backbone.history.navigate("boardManagement/" + this.idb, {
                trigger: true
            });
        }
    });

    return BachecaHome;

});

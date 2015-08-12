define(function(require) {

    var Backbone = require("backbone");
    var Bacheca = require("models/Bacheca");
    var Utils = require("utils");
    var Postit = require("models/Postit");
    var Postits = require("collections/Postits");
    var Commento= require("models/Commento");
    var Relazione = require("models/Relazione");
    var Baasbox = require("baasbox");
    var ShowPostitsNoticeboard = require("views/pages/ShowPostitsNoticeboard");

    var Bacheche = require("collections/Bacheche");

    var BachecaHome = Utils.Page.extend({

        constructorName: "BachecaHome",

        model: Bacheca,

        initialize: function(idb, ruolo) {
            this.idb = idb;
            console.log(ruolo);
            this.ruolo=ruolo;
            // load the precompiled template
            this.template = Utils.templates.structureBoard;

            document.getElementById("header").classList.add('hide');
            document.getElementById("navigation").classList.add('hide');
            //document.getElementById("queryError").classList.add("hide");
            //spinner.stop();

            this.bacheca = new Bacheca();
            this.postits = new Postit();
            this.relazione = new Relazione();
            this.commento = new Commento();

            //Mi metto in ascolto dell'evento che mi ritorna i dati di una bacheca
            this.bacheca.on("datiBacheca", this.appendTitle, this);
            //Mi metto in ascolto di eventuali errori nel caricamento/salvataggio dei dati
            this.bacheca.on("error", this.error);

            //Mi metto in ascolto dell'evento che mi ritorna i postits di una bacheca
            this.postits.on("elencopostits", this.appendItems, this);
            //Mi metto in ascolto di eventuali errori nel caricamento/salvataggio dei dati
            this.postits.on("error", this.error);
            //Mi metto in ascolto dell'evento che mi ritora i nomi degli autori dei postit
            this.postits.on("eventoNomiAutori", this.appendItems2, this);
            //Mi metto in ascolto della funzione che si occupa del salvataggio di nuovi postit
            this.postits.on("eventoAggiungiPostit", this.createPostit, this);
            //Mi metto in ascolto della funzione che ritorna i dati dell'autore del postit creato
            this.postits.on("datiAutore", this.createPostit2, this);
            //Mi metto in ascolto del risulato della query di eliminazione del postit
            this.postits.on("rimuoviPostit", this.deleteComments, this);
            //Mi metto in ascolto del risutato della query di eliminazione dei commenti del postit eliminato
            this.commento.on("rimuoviCommenti", this.deleteRelations, this);

            this.relazione.on("eliminateRelazioniPostit", this.updateRelations, this);
            //Mi metto n asclto del risultato della query che restituisce l'elenco delle relazioni
            this.relazione.on("elencorelazioni", this.appendRelations, this);

            this.relazione.on("eventoAggiungiRelazione", this.aggiungiRelazione,this);
        },

        id: "bachecahome",
        className: "i-g page",
        postit: 1,
        dragmode: 0,
        drag_start_pos : {
                x: 0,
                y: 0
            },
            drag_start_size:{
              w: 0,
              h:0
            },
        drag_start_tap_pos: {
          x: 0,
          y: 0
        },

        //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
        events: {
            "tap #goToHome": "goToHome",
            "tap #boardManagement": "goToBoardManagement",
            "tap #aprimenu": "gestionemenu",
            "tap #addPostit": "addPostit",
            "tap #newPostit": "addPostit",
            "tap #backBoard": "goBack",
            "tap .postit": "manageAction",
            "tap .rename": "rename",
            "touchstart .postit": "saveEvent",
            "longTap .postit": "enableIcons",
            "touchstart .fa-arrows": "startDrag",
            "touchmove .fa-arrows": "drag",
            "touchend .fa-arrows": "endDrag",
            "tap .overlay": "hideElements",
            "tap .menuRename" : "renameManagement",
            "tap .menuRelation" : "reltionManagement",
            "tap .relation": "selectedPostitRelation",
            "tap .menuDelete" : "deletePostit",
            "touchstart #boardCanvas" : "manageDeleteRelation"         
        },
        manageDeleteRelation: function(e){
            var p=this.getTapPos(e);
            console.log(p);
            for (var i=0; i<this.rel.length;i++){
                var postitpartenza= document.getElementById(this.rel[i].idp1);
                var postitarrivo = document.getElementById(this.rel[i].idp2);
                var px = parseInt(postitpartenza.style.left)+parseInt(postitpartenza.style.width)/2;
                var py = parseInt(postitpartenza.style.top)+parseInt(postitpartenza.style.height)/2;
                //Destinazione 44 è l'altezza della navigation bar
                var ax = parseInt(postitarrivo.style.left)+parseInt(postitarrivo.style.width)/2;
                var ay = parseInt(postitarrivo.style.top)+parseInt(postitarrivo.style.height)/2;
                console.log((p.y-py)/(ay-py));
                    console.log((p.x-px)/(ax-px));
                //controllo che il touch sia sulla relazione verificando l'equazione della retta con un margine di errore
                var eq=(p.y-py)/(ay-py)-(p.x-px)/(ax-px);
                if(eq>-0.05 && eq<0.05){
                    console.log("INSERIRE MENU RELAZIONE PER ELIMINARLA");
                    console.log(this.rel[i].id);
                    console.log("AL TAP SU ELIMINA")
                    this.rel.splice(i,1);
                    this.appendRelations(this.rel);
                }

            }
        },
        verificaRuolo:function(){
            var management=document.getElementById('boardManagement');
            if(this.ruolo=='manager'){
                if(management.classList.contains('hide')){
                    management.classList.remove('hide');
                }
            }
            else{
                management.classList.add('hide');
            }  
        },
        caricaDati:function(){
            this.bacheca.noticeboardData(this.idb);
        },
        goBack: function() {
            window.history.back();
        },
        error: function() {
            //document.getElementById("queryError").classList.remove('hide');
        },
        //inserisce il titolo della bacheca nella pagina
        appendTitle: function(result) {
            console.log(result[0].nome);
            this.titolo=result[0].nome;
            document.getElementById("titleBacheca").innerHTML = result[0].nome;

            //chiamo la funzione per prendere i postit
            this.postits.elencoPostitBacheca(this.idb);
        },
        appendItems: function(res) {
            if(res.length!=0){
                this.result=res;
                this.postits.nomeAutori(res);      
            }
            else{
                this.trigger("stop");
            }
        },
        appendItems2: function(res){
            var b = new Postits();
            for (var i = 0; i < this.result.length; i++) {
                for(var j=0; j<res.length;j++){
                    if (this.result[i].idu==res[j].id){
                        this.result[i].idu=res[j].username;
                        break;
                    }
                }
            }

            b.add(this.result);
            this.subView = (new ShowPostitsNoticeboard({
                collection: b
            })).render().el;
            //quando i dati vengono caricati faccio la render della pagina contenente la lista delle bacheche
            //$('#boardContent').append(this.subView);
            var elements = this.subView.getElementsByClassName('menuPostit');
            for (var i=0; i< elements.length;i++){
                if(elements[i].getAttribute("data-autore")!=localStorage.getItem('usernameLogged')){
                    if(this.ruolo=='user'){
                        elements[i].classList.add('hide');
                    }
                }
            }
            document.getElementById("boardContent").appendChild(this.subView);
            this.relazione.elencoRelazioniBacheca(this.idb);
        },
        appendRelations: function(res){
            this.rel=res;
            $("#boardCanvas").remove();
            var el = document.createElement("canvas");
            el.classList.add("absolute");
            el.classList.add("canvas");
            el.width  = window.innerWidth;
            el.height = window.innerHeight-44;
            el.id="boardCanvas";
            document.getElementById("canvas").appendChild(el);
            var canvas=el;
            var ctx = canvas.getContext('2d');
            for (var i=0; i< res.length; i++){
                //Inizio del disegno
                ctx.beginPath();
                //Origine 44 è l'altezza della navigation bar
                var postitpartenza= document.getElementById(res[i].idp1);
                var postitarrivo = document.getElementById(res[i].idp2);
                var px = parseInt(postitpartenza.style.left)+parseInt(postitpartenza.style.width)/2;
                var py = parseInt(postitpartenza.style.top)+parseInt(postitpartenza.style.height)/2-44;
                ctx.moveTo(px,py);
                //Destinazione 44 è l'altezza della navigation bar
                var ax = parseInt(postitarrivo.style.left)+parseInt(postitarrivo.style.width)/2;
                var ay = parseInt(postitarrivo.style.top)+parseInt(postitarrivo.style.height)/2-44;
                ctx.lineTo(ax, ay);
                //Visualizza il disegno
                ctx.stroke();
            }
            this.trigger("stop");
        },
        render: function() {
            $(this.el).html(this.template());          
            return this;
        },
        manageCanvas:function(){
            var ctx = document.getElementById('boardCanvas');
            ctx.width  = window.innerWidth;
            ctx.height = window.innerHeight-44;
        },
        manageAction: function(e) {
            var obj = e.target;
            if(obj.classList.contains("fa-pencil")){
                this.showPopup(e.currentTarget.id);
            }
            else{
                this.goToComments(e);
            }
        },
        //Viene gestita l'apertura e la chiusura del menu laterale
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
        //Aggiunge i postit alla bacheca
        addPostit: function(e) {
            console.log("BENE!!!!!");
            this.postits.aggiungiPostit(this.idb, "Postit" + this.postit, localStorage.getItem("idu"), "80px", "123px", (this.postit * 10)+"px", ((this.postit * 10) + 50)+"px","#f4f4f4", "helvetica","20");
            //Gestione Salvataggio postit

        },
        createPostit: function(result){
            this.resultpostit=result;
            this.postits.nomeAutore(result.idu);
            console.log(result.idu)
        },
        createPostit2: function(result){
            console.log(result);
            this.resultpostit.idu=result;
            var post=new Postits();
            post.add(this.resultpostit);
            this.subView = (new ShowPostitsNoticeboard({collection: post})).render().el;
            console.log(this.subView);
            document.getElementById("boardContent").appendChild(this.subView);
            this.showDialog(this.resultpostit.id);
        },
        
        //Funzione che gestisce la visibilità del dialog di rinomina postit
        showDialog: function(idp) {
            console.log("showDialog");
            var popScreen = document.getElementById(idp + "RenameScreen");
            var popPopup = document.getElementById(idp + "RenamePopup");
            popScreen.classList.toggle('hide');
            popPopup.classList.toggle('hide');
        },
        //Funzione di rinomina del postit
        rename: function(e) {
            console.log("rename");
            var obj = e.currentTarget.parentNode;
            var postit = document.getElementById(obj.id.replace("RenamePopup", ""));
            if (obj.childNodes[1].value != "") {
                postit.childNodes[1].innerHTML = obj.childNodes[1].value;
                this.postits.saveContenuto(obj.id.replace("RenamePopup", ""),obj.childNodes[1].value);
            }
            this.showDialog(obj.id.replace("RenamePopup", ""));
            //this.postits.aggiungiPostit(this.idb, postit.firstChild.innerHTML, localStorage.getItem("idu"), "", "", x, y);            
            this.postit++;
        },
        //Funzione di salvataggio del postit
        save: function(result) {
            this.postits.aggiungiPostit(this.idb, "Postit" + this.postit, localStorage.getItem("nameLogged"), 80, 123, (this.postit * 10), (this.postit * 10) + 50);
        },
        showPopup: function(idp){       
            var popScreen = document.getElementById(idp + "LinkScreen");
            var popPopup = document.getElementById(idp + "LinkPopup");
            popScreen.classList.toggle('hide');
            popPopup.classList.toggle('hide');
        },
        hideElements: function(e){
            var obj = e.currentTarget;
            var popPopup = document.getElementById(obj.id.replace("Screen","Popup"));
            popPopup.classList.toggle('hide');
            obj.classList.toggle('hide');
        },
        enableIcons: function(e) {
            var obj = e.currentTarget;
            obj.classList.add("fa-arrows");
            this.startDrag(this.event);
            //var move = document.createElement("i");
            //move.classList.add("fa", "fa-arrows", "fa-4x", "absolute","icons-postit");
            //obj.appendChild(move);
        },
        saveEvent: function(e){
            this.event=e;
        },
        deletePostit: function(e){
            this.obj = e.target;
            console.log(this.obj);
            this.idp = this.obj.parentNode.parentNode.id.replace('LinkPopup',''); 
            console.log(this.idp);
            this.postits.rimuoviPostit(this.idp);
        },
        deleteComments: function(res){
            $("#"+res).remove();
            $("#"+res+"LinkPopup").remove();
            $("#"+res+"RenameScreen").remove();
            $("#"+res+"RenamePopup").remove();
            $("#"+res+"LinkScreen").remove();
            this.commento.idRigheCommenti(this.idp);
        },
        deleteRelations:function(res){
            this.relazione.rimuoviRelazioniPostit(this.idp);
        },
        updateRelations:function(res){
            for (var i=0;i<res.length;i++){
                for(var j=0; j<this.rel.length;j++){
                    if(res[i].id==this.rel[j]){
                        this.rel.splice(j,1);
                    }
                }
            }
            this.relazione.elencoRelazioniBacheca(this.idb);
        },
        aggiungiRelazione: function(res){
            //aggiungo all'insieme delle relazioni
            this.rel[this.rel.length]=res;
        },
        startDrag: function(e) {
            console.log("start");
            e.preventDefault();
            e.stopPropagation();

            var drag_object = e.currentTarget;
            //var drag_object = e.currentTarget.parentNode;
            
            //posizione iniziale del mouse
            //initial mouse psition
            this.drag_start_tap_pos = this.getTapPos(e);
            //posizione iniziale dell'oggetto
            //initial object position
            this.drag_start_pos = {
                x: drag_object.offsetLeft,
                y: drag_object.offsetTop
            };
            //dimensioni iniziali dell'oggetto      
            //initial object size
            this.drag_start_size = {
                w: drag_object.offsetWidth,
                h: drag_object.offsetHeight
            };
            if ((this.drag_start_tap_pos.x - this.drag_start_pos.x >= this.drag_start_size.w - 10) && (this.drag_start_tap_pos.y - this.drag_start_pos.y >= this.drag_start_size.h - 10)) {
                //attiviamo la modalità "ridimensiona"
                //activate the resize mode
                this.dragmode = 2;
                //impostiamo il cursore appropriato
                //set the corresponding cursor
                drag_object.style.cursor = "se-resize";


            } else {
                //attiviamo la modalità "sposta"
                //activate the move mode
                this.dragmode = 1;
                //impostiamo il cursore appropriato
                //set the corresponding cursor
                drag_object.style.cursor = "move";
            }
        },
        drag: function(e) {
            //console.log("move");
            //posizione corrente del mouse
            //current mouse position
            
            var drag_object = e.currentTarget;
            //var drag_object = e.currentTarget.parentNode;


            var drag_current_tap_pos = this.getTapPos(e);
            //var mode = parseInt(this.dragmode);
            switch (this.dragmode) {
                //spostamento
                //move
                case 1:
                    //console.log("moveIt!");
                    //calcoliamo la nuova posizione dell'oggetto misurando lo spostamento del mouse dalla sua posizione iniziale
                    //calculate the new object position using the mouse distance from its initial position
                    var newX = this.drag_start_pos.x + (drag_current_tap_pos.x - this.drag_start_tap_pos.x);
                    var newY = this.drag_start_pos.y + (drag_current_tap_pos.y - this.drag_start_tap_pos.y);
                    //e la impostiamo sull'oggetto
                    //and set it in the object
                    // console.log(newX);
                    // console.log(newY);
                    if ((newX >= 0 && newY >= 44) && (newX + this.drag_start_size.w <= screen.width && newY + this.drag_start_size.h <= screen.height)) {
                        drag_object.style.left = newX + "px";
                        drag_object.style.top = newY + "px";
                    }
                    this.appendRelations(this.rel);
                    break;
                    //ridimensionamento
                    //resize
                case 2:
                    //calcoliamo la nuova dimensione dell'oggetto misurando lo spostamento del mouse dalla sua posizione iniziale
                    //calculate the new object size using the mouse distance from its initial position
                    var newW = this.drag_start_size.w + (drag_current_tap_pos.x - this.drag_start_tap_pos.x);
                    var newH = this.drag_start_size.h + (drag_current_tap_pos.y - this.drag_start_tap_pos.y);
                    //e la impostiamo sull'oggetto
                    //and set it in the object
                    drag_object.style.width = newW + "px";
                    drag_object.style.height = newH + "px";


                    break;
            }
        },
        endDrag: function(e) {
            console.log("end");
            var drag_object = e.currentTarget;
            //var drag_object = e.currentTarget.parentNode;
            drag_object.style.cursor = "auto";
            drag_object.classList.remove("fa-arrows");
            //drag_object.removeChild(drag_object.lastChild);
            this.postits.saveXY(drag_object.id,drag_object.style.left,drag_object.style.top);
        },
        getTapPos: function(e) {
            if (e.originalEvent.touches[0].pageX || e.originalEvent.touches[0].pageY) {
                return {
                    x: e.originalEvent.touches[0].pageX,
                    y: e.originalEvent.touches[0].pageY
                };
            } else if (e.originalEvent.touches[0].clientX || e.originalEvent.touches[0].clientY) {
                //usiamo le proprietà nonstandard scrollLeft e scrollTop per determinare la porzione di documento visualizzata nel browser
                //we use the scrollLeft and scrollTop properties to determine the part of the document shown in the browser
                return {
                    x: e.originalEvent.touches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                    y: e.originalEvent.touches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop
                };
            } else return {
                x: 0,
                y: 0
            }
        },
        renameManagement:function(e){
            var idPopup = e.target.parentNode.parentNode.id;
            this.showDialog(idPopup.replace("LinkPopup",""));
            this.showPopup(idPopup.replace("LinkPopup",""));
        },
        reltionManagement:function(e){
            console.log(e.target.parentNode.parentNode);
            var idp = e.target.parentNode.parentNode;
            document.getElementById(idp.id).classList.add('hide');
            document.getElementById(idp.id.replace('LinkPopup', 'LinkScreen')).classList.add('hide');
            var id = idp.id.replace('LinkPopup','');
            this.relationStart=id;
            console.log(this.relationStart);

            this.activateSelectionPostit();  
        },
        activateSelectionPostit: function(){
            console.log("entrato");
            var elenco= document.getElementsByClassName("postit");
            var a = new Array();
            for (var i=0; i<elenco.length;i++){
                a[i]=elenco[i].id;
            }
            for (var i=0; i<a.length;i++){
                if (a[i]!=this.relationStart){
                    document.getElementById(a[i]).classList.add("relation");
                    document.getElementById(a[i]).classList.remove("postit");
                }
            }
        },
        selectedPostitRelation: function(e){
            console.log(e);
            var idp = e.currentTarget.id;
            var postitpartenza = document.getElementById(this.relationStart);
            var postitarrivo= document.getElementById(idp);
            
            var canvas = document.getElementById('boardCanvas');
            var ctx = canvas.getContext('2d');
            //Inizio del disegno
            ctx.beginPath();
            //Origine 44 è l'altezza della navigation bar
            var px = parseInt(postitpartenza.style.left)+parseInt(postitpartenza.style.width)/2;
            var py = parseInt(postitpartenza.style.top)+parseInt(postitpartenza.style.height)/2-44;
            console.log(px+" "+py);
            ctx.moveTo(px,py);
            //Destinazione 44 è l'altezza della navigation bar
            var ax = parseInt(postitarrivo.style.left)+parseInt(postitarrivo.style.width)/2;
            var ay = parseInt(postitarrivo.style.top)+parseInt(postitarrivo.style.height)/2-44;
            console.log(ax+" "+ay);
            ctx.lineTo(ax, ay);
            //Visualizza il disegno
            ctx.stroke();
            var elenco= document.getElementsByClassName("relation");
            var a = new Array();
            for (var i=0; i<elenco.length;i++){
                a[i]=elenco[i].id;
            }
            for (var i=0; i<a.length;i++){
                document.getElementById(a[i]).classList.add("postit");
                document.getElementById(a[i]).classList.remove("relation");
            }
            this.relazione.aggiungiRelazione(this.idb,postitpartenza.id, postitarrivo.id,"");
            
        },
        //Funzioni di cambio pagina
        goToHome: function(e) {
            Backbone.history.navigate("homeSiwyt", {
                trigger: true
            });
        },
        goToComments: function(e) {
            //e.stopPropagation();
            Backbone.history.navigate("postit/"+e.currentTarget.id+"/"+this.idb, {
                trigger: true
            });
            
        },
        goToBoardManagement: function(e) {
            localStorage.setItem("titolo", ""+this.titolo);
            console.log(this.idb);
            localStorage.removeItem('utenti');
            localStorage.removeItem('responsabili');
            Backbone.history.navigate("boardManagement/" + this.idb+"/"+this.id, {
                trigger: true
            });
        }
    });

    return BachecaHome;

});

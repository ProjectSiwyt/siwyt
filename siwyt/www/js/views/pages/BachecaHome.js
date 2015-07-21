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
            //Mi metto in ascolto dell'evento che mi ritora i nomi degli autori dei postit
            this.postits.on("eventoNomiAutori", this.appendItems2, this);
            //Mi metto in ascolto della funzione che si occupa del salvataggio di nuovi postit
            this.postits.on("eventoAggiungiPostit", this.createPostit, this);
            //Mi metto in ascolto della funzione che ritorna i dati dell'autore del postit creato
            this.postits.on("datiAutore", this.createPostit2, this);
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
            "longTap .postit": "enableIcons",
            "touchstart .fa-arrows": "startDrag",
            "touchmove .fa-arrows": "drag",
            "touchend .fa-arrows": "endDrag",
            "tap .overlay": "hideElements",
            "tap .menuRename" : "renameManagement"          
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
            this.result=res;
            this.postits.nomeAutori(res);
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
            document.getElementById("boardContent").appendChild(this.subView);
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
            this.postits.aggiungiPostit(this.idb, "Postit" + this.postit, localStorage.getItem("idu"), "80px", "123px", (this.postit * 10)+"px", ((this.postit * 10) + 50)+"px","#f4f4f4");
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
            console.log("BENE!!!!!");
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
            var move = document.createElement("i");
            move.classList.add("fa", "fa-arrows", "fa-4x", "absolute","icons-postit");
            obj.appendChild(move);
        },
        startDrag: function(e) {
            console.log("start");
            e.preventDefault();
            e.stopPropagation();

            var drag_object = e.currentTarget.parentNode;
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
            console.log("move");
            //posizione corrente del mouse
            //current mouse position
            var drag_object = e.currentTarget.parentNode;
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
            var drag_object = e.currentTarget.parentNode;
            drag_object.style.cursor = "auto";
            drag_object.removeChild(drag_object.lastChild);
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

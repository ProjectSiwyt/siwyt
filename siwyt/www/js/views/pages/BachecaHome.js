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
            //Mi metto in ascolto della funzione che si occupa del salvataggio di nuovi postit
            this.postits.on("eventoAggiungiPostit", this.createPostit, this);
            //chiama la funzion che calcola i dati che restituisce i dati della bacheca con id idb
            this.bacheca.noticeboardData(idb);

        },

        id: "bachecahome",
        className: "i-g page",
        postit: 1,
        drag_start_border: "",
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
            "tap .postit": "manageAction",//"goToComments",
            "tap #aprimenu": "gestionemenu",
            "tap #addPostit": "addPostit",
            "tap #newPostit": "addPostit",
            "tap #backBoard": "goBack",
            "tap .rename": "rename",
            "longTap .postit": "enableIcons",
            "touchstart .fa-arrows": "startDrag",
            "touchmove .fa-arrows": "drag",
            "touchend .fa-arrows": "endDrag",
            "tap .overlay": "hideElements"

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
            this.titolo=result[0].nome;
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

        manageAction: function(e) {
            var obj = e.target;
            if(obj.classList.contains("fa-pencil")){
                this.showPopup(e);
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
            this.postits.aggiungiPostit(this.idb, "Postit" + this.postit, localStorage.getItem("nameLogged"), 80, 123, (this.postit * 10), (this.postit * 10) + 50);
            //Gestione Salvataggio postit

        },
        //Funzione che si occupa della creazione di nuovi postit
        createPostit: function(res) {
            var boardContent = document.getElementById("boardContent");
            //Creazione postit
            //Contenitore postit
            var postit = document.createElement("div");
            postit.id = res.idp;
            postit.style.left = res.x + "px";
            postit.style.top = res.y + "px";
            //Elementi del corpo del postit            
            var h3 = document.createElement("h3");
            var autore = document.createElement("div");
            var data = document.createElement("div");
            var link = document.createElement("a");
            var pencil = document.createElement("i");
            h3.classList.add("postit-title");
            h3.innerHTML = res.contenuto;
            autore.classList.add("pull-left", "caption");
            autore.innerHTML = res.idu;
            data.classList.add("pull-right", "caption");
            data.innerHTML = res.data;
            link.id = res.idp + "Link";
            link.classList.add("popup");
            pencil.classList.add("fa", "fa-pencil");
            link.appendChild(pencil);
            postit.appendChild(h3);
            postit.appendChild(autore);
            postit.appendChild(data);
            postit.appendChild(link);
            postit.classList.add("postit", "moveable", "block", "absolute", "center");
            boardContent.appendChild(postit);
            // Fine creazione postit
            // Creazione dialog per il rename
            var layerDialog = document.createElement("div");
            layerDialog.id = res.idp + "RenameScreen";
            layerDialog.classList.add("popup-screen", "overlay", "in", "hide");
            var dialog = document.createElement("div");
            dialog.id = res.idp + "RenamePopup";
            dialog.classList.add("postit-popup", "popup-container", "hide");
            var textarea = document.createElement("textarea");
            var submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Done";
            submit.classList.add("rename");
            dialog.appendChild(textarea);
            dialog.appendChild(submit);
            boardContent.appendChild(layerDialog);
            boardContent.appendChild(dialog);
            // Creazione popup menu
            var layerPopup = document.createElement("div");
            layerPopup.id = res.idp + "LinkScreen";
            layerPopup.classList.add("popup-screen", "overlay", "in", "hide");
            var popup = document.createElement("div");
            popup.id = res.idp + "LinkPopup";
            popup.classList.add("postit-popup", "popup-container", "hide");
            //Menu del popup
            var ul = document.createElement("ul");
            ul.classList.add("table-view", "border-table-view");
            //Nuova Relazione
            var li = document.createElement("li");
            li.classList.add("table-view-cell", "border-top", "media");
            li.innerHTML = "New relation";
            var span = document.createElement("span");
            span.classList.add("pull-right");
            var icon = document.createElement("i");
            icon.classList.add("fa","fa-plus");
            span.appendChild(icon);
            li.appendChild(span);
            ul.appendChild(li);
            // Rinomina
            li = document.createElement("li");
            li.classList.add("table-view-cell", "media");
            li.innerHTML = "Rename";
            span = document.createElement("span");
            span.classList.add("pull-right");
            icon = document.createElement("i");
            icon.classList.add("fa","fa-pencil");
            span.appendChild(icon);
            li.appendChild(span);
            ul.appendChild(li);
            // Cambia Colore
            li = document.createElement("li");
            li.classList.add("table-view-cell", "media");
            li.innerHTML = "Change Color:";
            var color = document.createElement("input");
            color.type = "color";
            color.value = "#ff0000";
            li.appendChild(color);
            ul.appendChild(li);
            // Cambia font
            li = document.createElement("li");
            li.classList.add("table-view-cell", "media");
            li.innerHTML = "Font:";
            var font = document.createElement("select");
            li.appendChild(font);
            ul.appendChild(li);
            // Cambia font size
            li = document.createElement("li");
            li.classList.add("table-view-cell", "media");
            li.innerHTML = "Font size:";
            var size = document.createElement("input");
            size.type = "number";
            size.value = "12";
            li.appendChild(size);
            ul.appendChild(li);
            // Cancella Postit
            li = document.createElement("li");
            li.classList.add("table-view-cell", "media");
            li.innerHTML = "Delete Postit";
            span = document.createElement("span");
            span.classList.add("pull-right");
            icon = document.createElement("i");
            icon.classList.add("fa","fa-trash-o");
            span.appendChild(icon);
            li.appendChild(span);
            ul.appendChild(li);

            popup.appendChild(ul);
            boardContent.appendChild(layerPopup);
            boardContent.appendChild(popup);
            this.showDialog(res.idp);
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
            if (obj.firstChild.value != "") {
                postit.firstChild.innerHTML = obj.firstChild.value;
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
        showPopup: function(e){        
            var popScreen = document.getElementById(e.currentTarget.id + "LinkScreen");
            var popPopup = document.getElementById(e.currentTarget.id + "LinkPopup");
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
            //bordo iniziale dell'oggetto     
            //initial object border
            this.drag_start_border = drag_object.style.border;
            drag_object.style.border = "2px dashed black";
            console.log(this.drag_start_tap_pos.x - this.drag_start_pos.x);
            console.log(this.drag_start_size.w - 10);
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
            drag_object.style.border = this.drag_start_border;
            drag_object.removeChild(drag_object.lastChild);

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
        //Funzioni di cambio pagina
        goToHome: function(e) {
            Backbone.history.navigate("homeSiwyt", {
                trigger: true
            });
            document.getElementById("header").style.display = 'block';
        },
        goToComments: function(e) {
            e.stopPropagation();
            alert("goToComments");
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

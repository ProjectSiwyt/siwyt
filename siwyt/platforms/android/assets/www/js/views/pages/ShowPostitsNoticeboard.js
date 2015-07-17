define(function(require) {

    var Backbone = require("backbone");
    var Postit = require("models/Postit");
    var Postits = require("collections/Postits");
    var Utils = require("utils");

    var ShowPostitsNoticeboard = Utils.Page.extend({

        constructorName: "ShowPostitsNoticeboard",

        model: Postit,

        initialize: function() {
            // load the precompiled template
            this.template = Utils.templates.contentListPostits;

            // here we can register to inTheDOM or removing events
            // this.listenTo(this, "inTheDOM", function() {
            //   $('#content').on("swipe", function(data){
            //     console.log(data);
            //   });
            // });
            // this.listenTo(this, "removing", functionName);

            // by convention, all the inner views of a view must be stored in this.subViews
        },

        id: "showpostitsnoticeboard",
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
            "doubleTap .postit": "showPopup",
            "touchstart .postit": "startDrag",
            "touchmove .postit": "drag",
            "touchend .postit": "endDrag"

        },

        render: function() {
            console.log(this.collection);
            $(this.el).html(this.template(this.collection.toJSON()));
            return this;
        },
        showPopup: function(e) {
            var popScreen = document.getElementById("" + e.currentTarget.id + "Screen");
            var popPopup = document.getElementById("" + e.currentTarget.id + "Popup");
            popScreen.classList.toggle('hide');
            popPopup.classList.toggle('hide');
        },
        startDrag: function(e) {
            console.log("start");
            e.preventDefault();
            e.stopPropagation();

            var drag_object = e.currentTarget;
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
            var drag_object = e.currentTarget;
            var drag_current_tap_pos = this.getTapPos(e);
            //var mode = parseInt(this.dragmode);
            switch (this.dragmode) {
                //spostamento
                //move
                case 1:
                    console.log("moveIt!");
                    //calcoliamo la nuova posizione dell'oggetto misurando lo spostamento del mouse dalla sua posizione iniziale
                    //calculate the new object position using the mouse distance from its initial position
                    var newX = this.drag_start_pos.x + (drag_current_tap_pos.x - this.drag_start_tap_pos.x);
                    var newY = this.drag_start_pos.y + (drag_current_tap_pos.y - this.drag_start_tap_pos.y);
                    //e la impostiamo sull'oggetto
                    //and set it in the object
                    console.log(newX);
                    console.log(newY);
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
            var drag_object = e.currentTarget;
            drag_object.style.cursor = "auto";
            drag_object.style.border = this.drag_start_border;

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
        }

    });

    return ShowPostitsNoticeboard;

});

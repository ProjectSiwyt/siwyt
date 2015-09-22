define(function(require) {

    var Backbone = require("backbone");
    var Utente = require("models/Utente");
    var Utils = require("utils");
    var $ = require("jquery");
    var Spinner = require("spin");

    var Tutorial = Utils.Page.extend({

        constructorName: "Tutorial",

        model: Utente,

        initialize: function() {
            // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
            this.template = Utils.templates.tutorial;
            document.getElementById("navigation").classList.add('hide');
            var header = document.getElementById('header').classList.add('hide');
            this.utente = new Utente();
            //query per modificare campo visto


            var opts = {
                lines: 13 // The number of lines to draw
                    ,
                length: 11 // The length of each line
                    ,
                width: 7 // The line thickness
                    ,
                radius: 26 // The radius of the inner circle
                    ,
                scale: 1 // Scales overall size of the spinner
                    ,
                corners: 1 // Corner roundness (0..1)
                    ,
                color: '#000' // #rgb or #rrggbb or array of colors
                    ,
                opacity: 0.25 // Opacity of the lines
                    ,
                rotate: 0 // The rotation offset
                    ,
                direction: 1 // 1: clockwise, -1: counterclockwise
                    ,
                speed: 2 // Rounds per second
                    ,
                trail: 60 // Afterglow percentage
                    ,
                fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                    ,
                zIndex: 2e9 // The z-index (defaults to 2000000000)
                    ,
                className: 'spinner' // The CSS class to assign to the spinner
                    ,
                top: '50%' // Top position relative to parent
                    ,
                left: '50%' // Left position relative to parent
                    ,
                shadow: false // Whether to render a shadow
                    ,
                hwaccel: false // Whether to use hardware acceleration
                    ,
                position: 'absolute' // Element positioning
            }

            this.spinner = new Spinner(opts);
            // here we can register to inTheDOM or removing events
            // this.listenTo(this, "inTheDOM", function() {
            //   $('#content').on("swipe", function(data){
            //     console.log(data);
            //   });
            // });
            // this.listenTo(this, "removing", functionName);

            // by convention, all the inner views of a view must be stored in this.subViews
        },

        id: "",
        className: "i-g page",
        current_screen: 1,

        //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
        events: {
            "swipeLeft": "goToLeft",
            "swipeRight": "goToRight",
            "tap #carousel-left": "goToLeft",
            "tap #carousel-right": "goToRight",
            "tap #skip": "skip"
        },

        render: function() {

            $(this.el).html(this.template());

            return this;
        },
        goToLeft: function(e) {
            var THIS = this;
            if (THIS.current_screen!=1) {
            var current = document.getElementById("screen_" + (THIS.current_screen - 1));   
                current.classList.remove("prev");
                var next = document.getElementById("screen_" + THIS.current_screen);
                next.classList.add("next");
                THIS.current_screen = THIS.current_screen - 1;
                var prev = document.getElementById("screen_" + (THIS.current_screen - 1));
                    prev.classList.add("prev");
                    prev.classList.remove("hide");                
            }
        },
        goToRight: function(e) {
            var THIS = this;
            if (THIS.current_screen!=2) {
                var current = document.getElementById("screen_" + (THIS.current_screen + 1));
                current.classList.remove("next");
                var prev = document.getElementById("screen_" + THIS.current_screen);
                prev.classList.add("prev");
                THIS.current_screen = THIS.current_screen + 1;
                var next = document.getElementById("screen_" + (THIS.current_screen + 1));
                next.classList.add("next");
                next.classList.remove("hide");
            } else {
                THIS.skip(e);
            }

        },
        skip: function(e) {
            localStorage.setItem("tutorial", "false");
            Backbone.history.navigate("homeSiwyt", {
                trigger: true
            });
        }
    });

    return Tutorial;

});

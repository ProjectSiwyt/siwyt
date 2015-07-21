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
            this.postit = new Postit();
            //Mi metto in ascolto del risultato della query di salvataggio del nuovo colore del postit
            this.postit.on("eventoSaveColore", this.changeColor, this);
            //Mi metto in ascolto del risultato della query di salvataggio del nuovo font del postit
            this.postit.on("eventoSaveFont", this.changeFont, this);
        },

        id: "showpostitsnoticeboard",

        //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
        events: {
            "change .menuColor" : "colorManagement",
            "change .menuFont" : "fontManagement",
            "tap .menuRelation" : "reltionManagement"
        },

        render: function() {
            console.log(this.collection);
            $(this.el).html(this.template(this.collection.toJSON()));
            return this;
        },
        colorManagement:function(e){
            this.obj = e.target;
            this.idp = this.obj.parentNode.parentNode.parentNode.id.replace('LinkPopup',''); 
            this.postit.saveColore(this.idp,this.obj.value);
        },
        changeColor:function(res){
            document.getElementById(""+this.idp).style.backgroundColor=this.obj.value;
        },
        fontManagement:function(e){
            this.obj = e.target;
            this.idp = this.obj.parentNode.parentNode.parentNode.id.replace('LinkPopup',''); 
            this.postit.saveFont(this.idp,this.obj.value);
        },
        changeFont:function(e){
            document.getElementById(""+this.idp).style.fontFamily=this.obj.value;
        },
        reltionManagement:function(e){
            debugger;
            var idp = e.target.parentNode.parentNode;
            var idp = idp.id.replace('LinkPopup','');
            var canvas = document.getElementById('boardCanvas');
            var postit = document.getElementById(idp);
            var ctx = canvas.getContext('2d');
            //Inizio del disegno
            ctx.beginPath();
            //Origine
            ctx.moveTo(postit.offsetWidth/2, postit.offsetHeight/2);
            //Destinazione
            ctx.lineTo(400,750);
            //Visualizza il disegno
            ctx.stroke();
        }

    });

    return ShowPostitsNoticeboard;

});

define(function(require) {

    var Backbone = require("backbone");
    var Postit = require("models/Postit");
    var Postits = require("collections/Postits");
    var Utils = require("utils");
    var Commento= require("models/Commento");
    var Relazione = require("models/Relazione");
    var Handlebars= require("handlebars");

    var ShowPostitsNoticeboard = Utils.Page.extend({

        constructorName: "ShowPostitsNoticeboard",

        model: Postit,

        initialize: function() {
            Handlebars.registerHelper("xif", function (a) {
                if(a=="tahoma"){
                    var obj='<select><option value="helvetica">Helvetica</option><option value="arial">Arial</option><option value="tahoma" selected="selected">Tahoma</option></select>';
                    return new Handlebars.SafeString(obj);
                }
                else if (a=="arial"){
                    var obj='<select><option value="helvetica">Helvetica</option><option value="arial" selected="selected">Arial</option><option value="tahoma">Tahoma</option></select>';
                    return new Handlebars.SafeString(obj);
                }
                else{
                    var obj='<select><option value="helvetica" selected="selected">Helvetica</option><option value="arial">Arial</option><option value="tahoma">Tahoma</option></select>';
                    return new Handlebars.SafeString(obj);   
                }
            });

            // load the precompiled template
            this.template = Utils.templates.contentListPostits;
            this.postit = new Postit();
            //Mi metto in ascolto del risultato della query di salvataggio del nuovo colore del postit
            this.postit.on("eventoSaveColore", this.changeColor, this);
            //Mi metto in ascolto del risultato della query di salvataggio del nuovo font del postit
            this.postit.on("eventoSaveFont", this.changeFont, this);
            //Mi metto in ascolto del risultato della query di salvataggio della nuova dimensione del testo del postit
            this.postit.on("eventoSaveDimensionFont", this.changeDimensionFont, this);
        },

        id: "showpostitsnoticeboard",

        //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
        events: {
            "change .menuColor" : "colorManagement",
            "change .menuFont" : "fontManagement",
            "change .menuDimension" : "fontDimensionManagement"
        },

        render: function() {
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
        fontDimensionManagement: function(e){
            this.obj = e.target;
            this.idp = this.obj.parentNode.parentNode.parentNode.id.replace('LinkPopup',''); 
            this.postit.saveDimensionFont(this.idp,this.obj.value);
        },
        changeDimensionFont:function(e){
            document.getElementById(this.idp+"Content").style.fontSize=this.obj.value+"px";
        }
    });

    return ShowPostitsNoticeboard;

});

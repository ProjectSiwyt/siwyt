define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Bacheche = require("collections/Bacheche");
  var Utils = require("utils");
  var Utente = require("models/Utente");

  var ShowListNoticeboardsContactsFull = Utils.Page.extend({

    constructorName: "ShowListNoticeboardsContactsFull",

    model: Bacheca,

    initialize: function() {
      this.template = Utils.templates.contentListBoardsContactsFull;
      // load the precompiled template
      /*console.log(document.getElementById("nameContact"));
      document.getElementById("nameContact").innerHTML=sessionStorage.getItem("nameContact");*/

      
     // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "listBoardsContactsFull",
    className: "i-g",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {

    },

    render: function() {
      $(this.el).html(this.template());
      return this;
    },

    chiudiPopup: function(e){
        idu = sessionStorage.getItem("idUserToAdd");
        var popScreen = document.getElementById("LinkScreen");
        var popPopup = document.getElementById(""+idu+"LinkPopup");
        popScreen.classList.toggle('hide');
        popPopup.classList.toggle('hide');
        $("#listBoardsContacts").remove();
    }

  });

  return ShowListNoticeboardsContactsFull;

});
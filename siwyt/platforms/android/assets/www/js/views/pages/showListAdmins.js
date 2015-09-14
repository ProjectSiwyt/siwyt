define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utenti = require("collections/Utenti");
  var Utils = require("utils");


  var showlistadmins = Utils.Page.extend({

    constructorName: "ShowListAdmins",

    model: Utente,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.contentListAdmins;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "showlistadmins",
    //className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap .rigamembro": "gestioneOpenClose",
      "tap .removeAdmin": "rimuovi"
      //"swipeLeft": "goToContacts"

    },

    render: function() {
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
    },
    //gestione apertura/chiusura sottomenu relativo ai membri di una bacheca
    gestioneOpenClose: function (e){
      console.log("OPENCLOSE");
      var el =document.getElementById("toggle"+e.currentTarget.id);
      el.classList.toggle('close-member');
      el.classList.toggle('open-member');
    },
    rimuovi: function(e){
      var el=document.getElementById(""+e.currentTarget.id).getAttribute("data-id");
      console.log(el);
      $("#toggle"+el).remove();
    },
    goToBacheca: function(e){
      console.log(this.model);
      Backbone.history.navigate("bacheca/"+e.currentTarget.id, {
        trigger: true
      });
    },
     goToContacts: function(e) {
      Backbone.history.navigate("contacts", {
        trigger: true
      });
    }
  });

  return showlistadmins;

});

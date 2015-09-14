define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Utente");
  var Bacheche = require("collections/Utenti");
  var Utils = require("utils");

  var showListAddContacts = Utils.Page.extend({

    constructorName: "ShowListAddContacts",

    model: Bacheca,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.contentListAddContacts;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "showlistaddcontacts",
    className: "i-g page size",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap .aggiungimembro": "gestioneMembri"
      //"swipeLeft": "goToContacts"

    },
    //gestione icona aggiungi/rimuovi membro
    gestioneMembri: function(e){
      var el=document.getElementById(""+e.currentTarget.id);
      el.classList.toggle('fa-user-plus');
      el.classList.toggle('fa-user-times');
    },

    render: function() {
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
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

  return showListAddContacts;

});

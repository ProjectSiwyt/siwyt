define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utenti = require("collections/Utenti");
  var Utils = require("utils");

  var ShowListContacts = Utils.Page.extend({

    constructorName: "ShowListContacts",

    //model: Bacheca,
    model: Utente,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.contentListContacts;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    //id: "showlistcontacts",
    className: "table-view",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      //"tap .rigabacheca": "goToBacheca",
      "swipeLeft": "goToHome"

    },

    render: function() {
      //debugger;
      console.log(this.collection);
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
    },

  
     goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
    }
  });

  return ShowListContacts;

});
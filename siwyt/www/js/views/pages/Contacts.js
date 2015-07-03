define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utente = require("models/Utente");
  var Utils = require("utils");


  var Contacts = Utils.Page.extend({

    constructorName: "Contacts",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.contacts;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "contacts",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "swipeRight": "goToHome",
      "swipeLeft": "goToProfile"
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html(this.template(this.model.models));

      return this;
    },

    goToProfile: function(e) {
      $(".active").attr("class","tab-item");
      $("#profile").attr("class","tab-item active");
      Backbone.history.navigate("profile", {
        trigger: true
      });

    },

    goToHome: function(e) {
      $(".active").attr("class","tab-item");
      $("#home").attr("class","tab-item active");
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
    }
  });

  return Contacts;

});
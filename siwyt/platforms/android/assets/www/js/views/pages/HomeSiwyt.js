define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Bacheca = require("models/Bacheca");
  var Utils = require("utils");
  var $ = require("jquery");

  var HomeSiwyt = Utils.Page.extend({

    constructorName: "HomeSiwyt",

    model: Bacheca,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.homeSiwyt;
      /*
      var prova = document.getElementById("content");
      prova.addEventListener("tap", go);
      function go(event){
        Backbone.history.navigate("contacts", {
        trigger: true
      });
      };
      */
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "homeSiwyt",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #profile": "goToProfile",
      "tap #contacts": "goToContacts"
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html(this.template(this.model.models));

      return this;
    },

    goToProfile: function(e) {
      Backbone.history.navigate("profile", {
        trigger: true
      });

    },

    goToContacts: function(e) {
      Backbone.history.navigate("contacts", {
        trigger: true
      });
    }
  });

  return HomeSiwyt;

});
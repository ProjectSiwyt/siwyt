define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utente = require("models/Utente");
  var Utils = require("utils");


  var Login = Utils.Page.extend({

    constructorName: "Login",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.login;
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "login",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #btn_login": "goToHome",
      "tap #sign_up": "goToRegister"
    },

    render: function() {
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));

      return this;
    },


    goToHome: function(e) {
      // ***************   con baasBox fare la parte di validazione dati e stampare errore o andare alla home   *****************************
      //debugger;
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
    },
  
  goToRegister: function(e) {
      Backbone.history.navigate("register", {
        trigger: true
      });
    }

  });
  return Login;

});
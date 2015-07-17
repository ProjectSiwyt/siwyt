define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utente = require("models/Utente");
  var Utils = require("utils");

  var Settings = Utils.Page.extend({

    constructorName: "Settings",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.appSettings;
      console.log("inzialize settings");
      document.getElementById("navigation").classList.add('hide');
      document.getElementById("settingsMenu").classList.add('hide');
      document.getElementById("title").innerHTML="Settings";
      var back=document.getElementById("back");
      if (back.classList.contains('hide')){
        back.classList.remove('hide');
      }
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "settings",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      //"swipeRight": "goBack",
      "tap #logout": "logOut",
      "tap #notification": "notification"
      
    },

    render: function() {
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));
      return this;
    },

    notification: function(e){
      alert("hjvkjhv");
    },

    logOut: function(e){
      //localStorage.removeItem("idu");
      localStorage.clear();
      Backbone.history.navigate("login",{
        trigger: true
      });
    },


    goBack: function() {
      window.history.back();
    }

  });

  return Settings;

});
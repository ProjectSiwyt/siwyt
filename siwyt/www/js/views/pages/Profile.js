define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utente = require("models/Utente");
  var Utils = require("utils");


  var Profile = Utils.Page.extend({

    constructorName: "Profile",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.profile;
      console.log("initialize template profile");
      /*document.getElementById("navigation").style.display="inline-block";
      document.getElementById("header").style.display="inherit";*/
      $("#navigation").removeAttr("style");
      $("#header").removeAttr("style");
      $("#settingsMenu").removeAttr("style");
      document.getElementById("back").style.display="none";

      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "profile",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "swipeRight": "goToHome",
      "tap #deleteAccount": "deleteAccount"
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html(this.template(this.model.models));

      return this;
    },

    deleteAccount: function(e){
      var del = window.confirm("Sei sicuro di voler eliminare il tuo account?");
    },

    goToHome: function(e) {
      /*$(".active").attr("class","tab-item");
      $("#contacts_menu").attr("class","tab-item active");*/
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });

    }
  });

  return Profile;

});
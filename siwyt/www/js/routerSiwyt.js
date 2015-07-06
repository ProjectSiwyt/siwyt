define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Utente = require("models/Utente");
  var Utenti = require("collections/Utenti");
  var MyModel = require("models/MyModel");
  var StructureViewSiwyt = require("views/structureViewSiwyt");
  var HomeSiwyt = require("views/pages/HomeSiwyt");
  var MyView = require("views/pages/MyView");
  var MapView = require("views/pages/MapView");
  var Contacts = require("views/pages/Contacts");
  var Profile = require("views/pages/Profile");
  var Settings = require("views/pages/Settings");
  var Bacheche = require("collections/Bacheche");

  var AppRouter = Backbone.Router.extend({
    constructorName: "AppRouter",

    routes: {
      // the default is the structure view, se nella url non è specificato nulla viene chiamata la funzione showStructure
      "": "showStructure",
      "homeSiwyt": "homeSiwyt",
      "profile": "profile",
      "contacts": "contacts",
      "settings": "settings"
    },

    firstView: "homeSiwyt",

    initialize: function(options) {
      this.currentView = undefined;
    },

    homeSiwyt: function() {
      // highlight the nav1 tab bar element as the current one
      //this.structureView.setActiveTabBarElement("nav1");
      // create a model with an arbitrary attribute for testing the template engine
      var model = new Bacheca({
        id: "1",
        nome: "Prova"
      });
      var model2 = new Bacheca({
        id: "2",
        nome: "Prova2"
      });
      var collection = new Bacheche();

      collection.add(model);
      collection.add(model2);
      // create the view
      var page = new HomeSiwyt({
        model: collection
      });
      // show the view
      this.changePage(page);
    },

    settings: function(){
      var page = new Settings();
      this.changePage(page);
    },

    contacts: function() {
      this.structureView.setActiveTabBarElement("nav1");
      var model= new Utente({
        id:"2",
        nome: "Luca",
        cognome: "Di Chiro",
        mail: "luca.dichiro@student.univaq.it",
        username: "bosco",
        password: "bosco"
      });
      var model2= new Utente({
        id:"3",
        nome: "Nicholas",
        cognome: "Angelucci",
        mail: "nicholas.angelucci@student.univaq.it",
        username: "richolas",
        password: "richolas"
      });
      var model3= new Utente({
        id:"4",
        nome: "Vincenzo",
        cognome: "Lanzieri",
        mail: "vincenzo.lanzieri@student.univaq.it",
        username: "vinzenio",
        password: "vinzenio"
      });
      var collection= new Utenti();
      collection.add(model);
      collection.add(model2);
      collection.add(model3);
      var page = new Contacts({
        model: collection
      });
      console.log(page);
      this.changePage(page);
    },

    profile: function(){
      var model= new Utente({
        id:"1",
        nome: "Luca",
        cognome: "Mangifesta",
        mail: "luca.mangifesta@student.univaq.it",
        username: "luca__91",
        password: "luca__91"
        //confermato non lo inserisco tanto è false di defaulta
      });
      var page = new Profile({
        model: model
      });
      this.changePage(page);
    },

    myView: function() {
      // highlight the nav1 tab bar element as the current one
      this.structureView.setActiveTabBarElement("nav1");
      // create a model with an arbitrary attribute for testing the template engine
      var model = new MyModel({
        key: "testValue"
      });
      // create the view
      var page = new MyView({
        model: model
      });
      // show the view
      this.changePage(page);
    },

    map: function() {
      // highlight the nav2 tab bar element as the current one
      this.structureView.setActiveTabBarElement("nav2");
      // create the view and show it
      var page = new MapView();
      this.changePage(page);
    },

    // load the structure view
    showStructure: function() {
      if (!this.structureView) {
        this.structureView = new StructureViewSiwyt();
        // put the el element of the structure view into the DOM
        //this.structureView.render().el chiama la funzione render della view structureView.js
        
        document.body.appendChild(this.structureView.render().el);
        this.structureView.trigger("inTheDOM");
      }
      // go to first view
      this.navigate(this.firstView, {trigger: true});
    },

  });

  return AppRouter;

});
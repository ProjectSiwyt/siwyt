define(function(require) {

  var $ = require("jquery");
  var _= require("underscore");
  var Backbone = require("backbone");
  var Baasbox=require("baasbox");
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
  var BachecaHome = require("views/pages/BachecaHome");
  var CreateBacheca = require("views/pages/CreateBacheca");
  var AddContacts = require("views/pages/AddContacts");
  var Postit = require("models/Postit");
  var Postits = require("collections/Postits");
  var ShowListNoticeboards = require("views/pages/ShowListNoticeboards");

  var AppRouter = Backbone.Router.extend({
    constructorName: "AppRouter",

    routes: {
      // the default is the structure view, se nella url non è specificato nulla viene chiamata la funzione showStructure
      "": "showStructure",
      "homeSiwyt": "homeSiwyt",
      "profile": "profile",
      "contacts": "contacts",
      "settings": "settings",
      "bacheca/:id": "showNoticeboard",
      "createBacheca": "create",
      "addContacts": "addContacts",
      "newBacheca/:nome": "newBacheca"
    },

    firstView: "homeSiwyt",
    BAASBOX_URL : "http://localhost:9000",
    BAASBOX_APP_CODE : "1234567890",

    initialize: function(options) {
      this.currentView = undefined;
        //initialize BaasBox
      BaasBox.setEndPoint(this.BAASBOX_URL); //the address of your BaasBox server
      BaasBox.appcode = this.BAASBOX_APP_CODE;               //the application code of your server
      
      //at the moment we log in as admin  
      BaasBox.login("admin", "admin")
          .done(function (user) {
              console.log("Logged in ", user);
              //once we are logged in, let's start backbone
              Backbone.history.start();
      })
          .fail(function (err) {
            console.log("error ", err);
      });
    },

    homeSiwyt: function() {
      // highlight the nav1 tab bar element as the current one
      this.structureView.setActiveTabBarElement("home");
      var page= new HomeSiwyt();
      this.changePage(page);

     },

    settings: function(){
      var page = new Settings();
      this.changePage(page);
    },

    contacts: function() {
      this.structureView.setActiveTabBarElement("contacts");
      /*
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
      console.log(collection);
      var page = new Contacts({
        model: collection
      });
      console.log(page);
      this.changePage(page);
      */
      
      //this.collection.each(this.renderOne, this);
      var ccc = new Utenti({model: Utente}); //= var contacts = new ContactManager.Collections.Contacts();
      var contactsDefer= ccc.fetch();
      console.log(ccc);
      var THIS=this;
      contactsDefer.done(function(res){
        console.log(res);
        var page = new Contacts({
            model: ccc
        });
        THIS.changePage(page);
      });
    },

    profile: function(){
      this.structureView.setActiveTabBarElement("profile");
      var model= new Utente({
        id:"1",
        nome: "Luca",
        cognome: "Mangifesta",
        mail: "luca.mangifesta@student.univaq.it",
        username: "luca__91",
        password: "luca__91"
        //confermato non lo inserisco tanto è false di defaulta
      });
      console.log(model);
      var page = new Profile({
        model: model
      });
      this.changePage(page);
    },

    create: function(){
      var model= new Utente({
        id:"1",
        nome: "Luca",
        cognome: "Mangifesta",
        mail: "luca.mangifesta@student.univaq.it",
        username: "luca__91",
        password: "luca__91"
        //confermato non lo inserisco tanto è false di default
      });
      var page = new CreateBacheca();
      this.changePage(page);
    }
    ,

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

    showNoticeboard: function(id){
        alert("showNoticeboard "+id);
        
        var THIS=this;
        BaasBox.loadCollection("Bacheca")
        .done(function(res) {
          for (var i=0; i<res.length; i++){
            if( res[i].id == id){
              console.log(res[i]);
              alert("id bacheca: " + res[i].id + "\nnome: " + res[i].nome);  //res[i].
              var model= new Bacheca({
                id: res[i].id, 
                nome: res[i].nome
              });
              console.log(model);
              var page = new BachecaHome({
                model: model
              });
              THIS.changePage(page);
            }
          }
        })
        .fail(function(error) {
          console.log("error ", error);
        })
    },
    addContacts: function(){
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
      var page = new AddContacts({
        model: collection
      });
      this.changePage(page);
    },
    newBacheca: function(nome){
      //aggiunge una nuova riga alla collezione "Bacheca"
      var post = new Object();
      post.nome = nome;
      var THIS=this
      //post.body = "Body of my post.";     
      BaasBox.save(post, "Bacheca")
        .done(function(res) {
          console.log("res ", res);
          Backbone.history.navigate("bacheca/"+res.id, {
            trigger: true
          });
        })
        .fail(function(error) {
          console.log("error ", error);
        })
     } 
  });

  return AppRouter;

});
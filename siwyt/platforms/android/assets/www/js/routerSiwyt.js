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
  var Login = require("views/pages/Login");
  var Register = require("views/pages/Register");
  var NoticeboardManagement = require("views/pages/NoticeboardManagement");

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
      "addContacts/:idpage/:idb": "addContacts",
      "newBacheca/:nome": "newBacheca",
      "login":"login",
      "register":"register",
      "boardManagement/:idb":"boardManagement"
    },

    BAASBOX_URL : "http://localhost:9000",
    BAASBOX_APP_CODE : "1234567890",

    initialize: function(options) {
      this.currentView = undefined;

      if(localStorage.getItem("idu")==null){
          this.firstView="login";
      }
      else{
        this.firstView="homeSiwyt";
      }
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
      this.structureView.setActiveTabBarElement("homeMenu");
      var page= new HomeSiwyt();
      this.changePage(page);

     },

    settings: function(){
      var page = new Settings();
      this.changePage(page);
    },
    
    login: function(){
      var page= new Login();
      this.changePage(page);
    },
    register: function(){
      var page= new Register();
      this.changePage(page);
    },
    boardManagement: function(idb){
      console.log("ciao2");
      var page= new NoticeboardManagement(idb);
      this.changePage(page);
      page.caricaMembri();
    },
    contacts: function() {
      this.structureView.setActiveTabBarElement("contactsMenu");
      var page = new Contacts();
      this.changePage(page);
    },

    profile: function(){
      this.structureView.setActiveTabBarElement("profileMenu");
      var model= new Utente({
        nome: localStorage.getItem("nameLogged"),
        cognome:localStorage.getItem("surnameLogged"),
        mail: localStorage.getItem("emailLogged"),
        username: localStorage.getItem("usernameLogged"),
        password: localStorage.getItem("passwordLogged")
        //confermato non lo inserisco tanto è false di defaulta
      });
      console.log(model);
      var page = new Profile({
        model: model
      });
      this.changePage(page);
    },

    create: function(){
      var page = new CreateBacheca();
      this.changePage(page);
      page.caricaDati();
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

    showNoticeboard: function(idb){
        var page = new BachecaHome(idb);
        this.changePage(page);

    },

    addContacts: function(idpage,idb){
      
      var page = new AddContacts(idpage, idb);
      this.changePage(page);
      page.loadData();
    }
    /*
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
     */ 
  });

  return AppRouter;

});
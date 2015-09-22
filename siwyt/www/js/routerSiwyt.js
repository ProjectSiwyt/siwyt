define(function(require) {

  var $ = require("jquery");
  var _= require("underscore");
  var Backbone = require("backbone");
  var Baasbox=require("baasbox");
  var Utente = require("models/Utente");
  var StructureViewSiwyt = require("views/StructureViewSiwyt");
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
  var PostitHome = require("views/pages/PostitHome");
  var Tutorial = require("views/pages/Tutorial");
  var Spinner= require("spin");

  var AppRouter = Backbone.Router.extend({
    constructorName: "AppRouter",

    routes: {
      // the default is the structure view, se nella url non è specificato nulla viene chiamata la funzione showStructure
      "": "showStructure",
      "homeSiwyt": "homeSiwyt",
      "profile": "profile",
      "contacts": "contacts",
      "settings": "settings",
      "bacheca/:id/:ruolo": "showNoticeboard",
      "createBacheca": "create",
      "addContacts/:idpage/:idb": "addContacts",
      "newBacheca/:nome": "newBacheca",
      "login":"login",
      "register":"register",
      "boardManagement/:idb/:idpage":"boardManagement",
      "postit/:idp/:idb": "postit",
      "activePushNotification": "activePushNotification",
      "tutorial": "tutorial"
    },

    BAASBOX_URL : "http://192.168.1.234:9000",

    BAASBOX_APP_CODE : "1234567890",

    initialize: function(options) {
      this.currentView = undefined;
        //initialize BaasBox
      var THIS = this;
      BaasBox.setEndPoint(this.BAASBOX_URL); //the address of your BaasBox server
      BaasBox.appcode = this.BAASBOX_APP_CODE;               //the application code of your server

      this.initializeSettings();

      navigator.splashscreen.hide();

      if(localStorage.getItem("idu")==null){
          this.firstView="login";
      }
      else{
        var utente = new Utente();
        //utente.logout();

        utente.login(localStorage.getItem("usernameLogged"), localStorage.getItem("passwordLogged"));
        this.firstView="homeSiwyt";
      }

      var opts = {
          lines: 13 // The number of lines to draw
          , length: 11 // The length of each line
          , width: 7 // The line thickness
          , radius: 26 // The radius of the inner circle
          , scale: 1 // Scales overall size of the spinner
          , corners: 1 // Corner roundness (0..1)
          , color: '#000' // #rgb or #rrggbb or array of colors
          , opacity: 0.25 // Opacity of the lines
          , rotate: 0 // The rotation offset
          , direction: 1 // 1: clockwise, -1: counterclockwise
          , speed: 2 // Rounds per second
          , trail: 60 // Afterglow percentage
          , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
          , zIndex: 2e9 // The z-index (defaults to 2000000000)
          , className: 'spinner' // The CSS class to assign to the spinner
          , top: '50%' // Top position relative to parent
          , left: '50%' // Left position relative to parent
          , shadow: false // Whether to render a shadow
          , hwaccel: false // Whether to use hardware acceleration
          , position: 'absolute' // Element positioning
      }
      
      this.spinner = new Spinner(opts);
      //console.log(this.el);
    },

    initializeSettings: function(e){
     var THIS = this;
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        var directoryReader = dir.createReader();

        directoryReader.readEntries(function(entries){
                                                var exist = false;
                                                for( var i=0; i<entries.length; i++){
                                                  if(entries[i].name=="settings.txt") exist=true;
                                                }
                                                console.log(THIS);
                                                THIS.checkSettings(exist);    
                                              }
                                  , function(){ console.log("errore readEntries");});

        });

    },


    checkSettings: function(exist){
      var THIS = this;
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        if(exist){
            dir.getFile("settings.txt",{create: false}, function(file){
            var setOb =  file;
            THIS.readSettings(setOb); 
            });
        } 
        else{
            console.log("not exist");
            dir.getFile("settings.txt", {create:true}, function(file) {
            console.log("got the file", file);
            var logOb = file;
            THIS.writeSettings("1;1;1;1", logOb);      
            });

        }

      });

      },

    readSettings: function(fileEntry) {
        var str;
        fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
            var settings_val = new Array(); 
            console.log("Text is: "+this.result);
            var riga = this.result.split(";");
            console.log(riga);
            for(var i =0; i< riga.length;i++){
              console.log("riga[elem]: ",riga[i]);
              settings_val[i]= riga[i];             
            }

            console.log("settings_val: ", settings_val);
            localStorage.setItem("boards", settings_val[0]);
            localStorage.setItem("sounds", settings_val[1]);
            localStorage.setItem("vibration", settings_val[2]);
            localStorage.setItem("tutorial", settings_val[3]);

        }

        reader.readAsText(file);
        });

    },

    writeSettings: function(str, logOb) {
          if(!logOb) return;
          //var log = str + " [" + (new Date()) + "]\n";
          //console.log("going to log "+log);
          logOb.createWriter(function(fileWriter) {
            
            var settings_val = new Array();
            fileWriter.seek(fileWriter.length);
            
            var blob = new Blob([str], {type:'text/plain'});
            fileWriter.write(blob);
            console.log("ok, in theory i worked");
            var riga = str.split(";");
            console.log(riga);
            for(var i =0; i< riga.length;i++){
              console.log("riga[elem]: ",riga[i]);
              settings_val[i]= riga[i];             
            }

            console.log("settings_val: ", settings_val);
            localStorage.setItem("boards", settings_val[0]);
            localStorage.setItem("sounds", settings_val[1]);
            localStorage.setItem("vibration", settings_val[2]);
            localStorage.setItem("tutorial", settings_val[3]);
          }, function(){console.log("errore write initial settings");});
        },

    homeSiwyt: function() {
      var THIS=this;
      // highlight the nav1 tab bar element as the current one
      this.structureView.setActiveTabBarElement("homeMenu");
      var page= new HomeSiwyt();
      var signal=false;
      page.on('stop', function(){THIS.spinner.stop(); signal=true;});
      this.changePage(page);
      setTimeout(function(){if(!signal){THIS.spinner.spin(document.body);}},1000);
      page.caricaDati();

     },

    settings: function(){
      var page = new Settings();
      this.changePage(page);
      this.spinner.stop();
      page.set_notification();
    },

    tutorial: function(){
      var page = new Tutorial();
      this.changePage(page);
      this.spinner.stop();
    },

    login: function(){
      var page= new Login();
      this.spinner.stop();
      this.changePage(page);
    },
    register: function(){
      this.spinner.stop();
      var page= new Register();
      this.changePage(page);
    },
    boardManagement: function(idb,idpage){
      var THIS=this;
      var page= new NoticeboardManagement(idb);
      var signal=false;
      page.on('stop', function(){THIS.spinner.stop(); signal=true;});
      this.changePage(page);
      setTimeout(function(){if(!signal){THIS.spinner.spin(document.body);}},1000);
      if(idpage=='bachecahome'){
        page.caricaDati();
        //page.caricaMembriDaHome();  
      }
      else{
        page.caricaMembriDaContacts();
      }
      
    },
    contacts: function() {
      this.structureView.setActiveTabBarElement("contactsMenu");
      var page = new Contacts();
      var signal=false;
      var THIS = this;
      page.on('stop', function(){THIS.spinner.stop(); signal=true;})
      this.changePage(page);
      setTimeout(function(){if(!signal){THIS.spinner.spin(document.body);}},1000);
      page.startQuery();
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
      var signal =false;
      page.on('stop', function(){THIS.spinner.stop();signal=true});
      this.changePage(page);
      var THIS = this;
      setTimeout(function(){if(!signal){THIS.spinner.spin(document.body);}},1000);
      page.startQuery();
    },

    create: function(){
      var THIS=this;
      var page = new CreateBacheca();
      var signal=false;
      page.on('stop', function(){THIS.spinner.stop(); signal=true;});
      this.changePage(page);
      setTimeout(function(){if(!signal){THIS.spinner.spin(document.body);}},1000);
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
    activePushNotification: function(){
        this.structureView = new StructureViewSiwyt();
        // put the el element of the structure view into the DOM
        //this.structureView.render().el chiama la funzione render della view structureView.js
        var main=document.getElementById("main");
        document.body.removeChild(main);
        document.body.appendChild(this.structureView.render().el);
        this.structureView.trigger("inTheDOM");
        //Access to the tutorial the first time of the app
        if(localStorage.getItem("tutorial")=="1"){ 
          this.navigate("tutorial", {trigger: true});
        }
        else{
          this.navigate("homeSiwyt", {trigger: true});  
        }        
    },

    showNoticeboard: function(idb, ruolo){
        var THIS=this;
        var page = new BachecaHome(idb, ruolo);
        var signal=false;
        page.on('stop', function(){THIS.spinner.stop(); signal=true;});
        this.changePage(page);
        setTimeout(function(){if(!signal){THIS.spinner.spin(document.body);}},1000);
        page.verificaRuolo();
        page.manageCanvas();
        page.caricaDati();

    },

    addContacts: function(idpage,idb){
      var THIS=this;
      var page = new AddContacts(idpage, idb);
      var signal=false;
      page.on('stop', function(){THIS.spinner.stop(); signal=true;});
      this.changePage(page);
      setTimeout(function(){if(!signal){THIS.spinner.spin(document.body);}},1000);
      page.loadData();
    },
    postit: function(idp, idb){
      var THIS=this;
      var page = new PostitHome(idp,idb);
      var signal=false;
      page.on('stop', function(){THIS.spinner.stop(); signal=true;});
      this.changePage(page);
      setTimeout(function(){if(!signal){THIS.spinner.spin(document.body);}},1000);
      page.caricaDati();
    }
  });

  return AppRouter;

});
define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utils = require("utils");
  var $ = require("jquery");
  


  var Settings = Utils.Page.extend({

    constructorName: "Settings",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      var THIS = this;
      this.template = Utils.templates.appSettings;
      console.log("inzialize settings");
      var header = document.getElementById("header");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      }
      document.getElementById("navigation").classList.add('hide');
      document.getElementById("settingsMenu").classList.add('hide');
      document.getElementById("title").innerHTML="Settings";
      var back=document.getElementById("back");
      if (back.classList.contains('hide')){
        back.classList.remove('hide');
      }
      this.utente = new Utente();
      this.utente.on("baasboxLogout", this.logOut , this) ;
      //this.set_notification();
      


      
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
    className: "i-g page size",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      //"swipeRight": "goBack",
      "tap #logout": "logOut",
      "tap .notification": "saveNotification"
      
    },

    render: function() {
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));
      return this;
    },


    set_notification: function(e){
      if(localStorage.getItem("notification_boards")=="1"){

        $("#boards").addClass("active");
      }
      else{
        $("#boards").removeClass("active");
      }

      if(localStorage.getItem("notification_sounds")=="1"){
        $("#sounds").addClass("active");
      }
      else{
        $("#sounds").removeClass("active");
      }
      
      if(localStorage.getItem("notification_vibration")=="1"){
        $("#vibration").addClass("active");
      }
      else{
        $("#vibration").removeClass("active");
      }
    },

    saveNotification: function(e){
      var THIS = this;
      console.log(e.currentTarget.id);
      var b = localStorage.getItem("notification_boards");
      var s = localStorage.getItem("notification_sounds");
      var v = localStorage.getItem("notification_vibration");
      var str = b+";"+s+";"+v;
      console.log(str);

      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        console.log("got main dir",dir);
        dir.getFile("settings.txt", {create:true}, function(file) {
          console.log("got the file", file);
          logOb = file;
          THIS.writeLog(str, logOb);      
        });

      });

    },

    writeLog: function(str, logOb) {
          if(!logOb) return;
          var log = str + " [" + (new Date()) + "]\n";
          console.log("going to log "+log);
          logOb.createWriter(function(fileWriter) {
            
            fileWriter.seek(fileWriter.length);
            
            var blob = new Blob([log], {type:'text/plain'});
            fileWriter.write(blob);
            console.log("ok, in theory i worked");
          }, fail);
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
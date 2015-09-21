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
      "tap .notification": "saveNotification",
      "swipeRight .notification": "saveNotification",
      "swipeLeft .notification": "saveNotification"


      
    },

    render: function() {
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));
      return this;
    },


    set_notification: function(e){
      if(localStorage.getItem("boards")=="1"){

        $("#boards").addClass("active");
      }
      else{
        $("#boards").removeClass("active");
      }

      if(localStorage.getItem("sounds")=="1"){
        $("#sounds").addClass("active");
      }
      else{
        $("#sounds").removeClass("active");
      }
      
      if(localStorage.getItem("vibration")=="1"){
        $("#vibration").addClass("active");
      }
      else{
        $("#vibration").removeClass("active");
      }
    },

    saveNotification: function(e){
      var THIS = this;
      console.log(e.currentTarget.id);
      if ($("#"+e.currentTarget.id).hasClass("active")) localStorage.setItem(e.currentTarget.id, 1);
      else localStorage.setItem(e.currentTarget.id, 0);
      var b = localStorage.getItem("boards");
      var s = localStorage.getItem("sounds");
      var v = localStorage.getItem("vibration");
      var str = b+";"+s+";"+v;
      console.log(str);

      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        console.log("got main dir",dir);
        dir.getFile("settings.txt", {create:false}, function(file) {
          console.log("got the file", file);
          logOb = file;
          THIS.writeSettings(str, logOb);      
        });

      });

    },

   writeSettings: function(str, logOb){
      if(!logOb) return;
            //var log = str + " [" + (new Date()) + "]\n";
            //console.log("going to log "+log);
            logOb.createWriter(function(fileWriter) {
              
              var settings_val = new Array();
              //fileWriter.seek(fileWriter.length);
              
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
              if(localStorage.getItem("boards")==1){
                $.ajax({
                    url:"http://"+this.BAASBOX_URL+"/push/enable/android/"+data.registrationId,
                    method: "PUT"
                  });
              }else{
                  $.ajax({
                      url:"http://"+this.BAASBOX_URL+"/push/disable/"+localStorage.getItem("registrationId"),
                      method: "PUT"
                  });
              }
            }, function(){console.log("errore write initial settings");});
          },

    logOut: function(e){
      //localStorage.removeItem("idu");
      localStorage.clear();
      console.log(localStorage.getItem("registrationId"));
      $.ajax({
          url:"http://"+this.BAASBOX_URL+"/push/disable/"+localStorage.getItem("registrationId"),
          method: "PUT"
      });
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
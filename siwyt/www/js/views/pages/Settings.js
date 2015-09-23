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
      this.utente.on("baasboxLogout", this.goToLogin , this) ;
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

    BAASBOX_URL : "http://192.168.1.64:9000",
    ICON: "/www/res/icon/android/icon-36-ldpi.png",
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
      var str = b+";"+s+";"+v+";0";
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
            var THIS=this;
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
                    console.log(push);
                    var vibration=false;
                    var sounds=false;
                    if(localStorage.getItem("vibration")==1){
                        vibration=true;
                    }
                    if(localStorage.getItem("sounds")==1){
                        sounds=true;
                    }
                    console.log(sounds,vibration);
                    window.push = PushNotification.init({ "android": {"senderID": "746595440813", "sound": sounds, "vibrate": vibration, "icon":THIS.ICON, "clearNotifications":"false"}}, true );
                    console.log(push);

                    push.on('registration', function(data) {
                        //alert(data.registrationId);
                        localStorage.setItem("registrationId", data.registrationId);
                        $.ajax({
                          url:THIS.BAASBOX_URL+"/push/enable/android/"+data.registrationId,
                          method: "PUT"
                        });
                    });
                
                    push.on('notification', function(data) {
                       window.plugins.toast.showWithOptions(
                            {
                              message: data.message,
                              position: "center",
                              duration: "long",
                              addPixelsY: -200
                            }
                      );
                      //data.message,
                      // data.title,
                      // data.count,
                      // data.sound,
                      // data.image,
                      // data.additionalData
                    });

                    push.on('error', function(e) {
                        // e.message
                    });
              }else{
                  $.ajax({
                      url:THIS.BAASBOX_URL+"/push/disable/"+localStorage.getItem("registrationId"),
                      method: "PUT"
                  });
                  localStorage.removeItem("registrationId");
              }
            }, function(){console.log("errore write initial settings");});
          },

    logOut: function(e){
      var THIS=this;
      //localStorage.removeItem("idu");
      console.log(localStorage.getItem("registrationId"));
      $.ajax({
          url:THIS.BAASBOX_URL+"/push/disable/"+localStorage.getItem("registrationId"),
          method: "PUT"
      }).done(function(res){
          this.utente.logout();
            });

    },

    goToLogin: function(e){
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
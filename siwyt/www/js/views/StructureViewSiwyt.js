define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");
  

  var StructureViewSiwyt = Backbone.View.extend({

    constructorName: "StructureViewSiwyt",

    id: "main",

    events: {
      "tap #settingsMenu": "settings",
      "tap #profileMenu": "goToProfile",
      "tap #contactsMenu": "goToContacts",
      "tap #homeMenu": "goToHome",
      "tap #back": "goBack"
    },

    BAASBOX_URL : "http://192.168.1.234:9000",
    ICON: "/www/res/icon/android/icon-36-ldpi.png",
    //initialize e render sono le funzioni che ci aspettiamo sempre in una view
    //initialize corrisponde ad un costruttore in java
    initialize: function(options) {
          var THIS=this;
          if(localStorage.getItem("usernameLogged")){
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
                if(localStorage.getItem("boards")==1){
                  $.ajax({
                    url:THIS.BAASBOX_URL+"/push/enable/android/"+data.registrationId,
                    method: "PUT"
                  });
                }else{
                      $.ajax({
                          url:THIS.BAASBOX_URL+"/push/disable/"+localStorage.getItem("registrationId"),
                          method: "PUT"
                      });
                }
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
      }
      // load the precompiled template (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structureSiwyt;
      /*
      $(document).ajaxStart(function(){
          document.getElementById("spinner");
      });
      */
      //this.on("inTheDOM", this.rendered);
      // bind the back event to the goBack function
      //document.getElementById("back").addEventListener("back", this.goBack(), false);
    },

    render: function() {
      // load the template
      this.el.innerHTML = this.template({});
      

      // cache a reference to the content element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },

    // rendered: function(e) {
    // },

    // generic go-back function
    goBack: function() {
      window.history.back();
    },
    goToProfile: function(e) {
      Backbone.history.navigate("profile", {
        trigger: true
      });

    },

    goToContacts: function(e) {
      Backbone.history.navigate("contacts", {
        trigger: true
      });
    },
    goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
    },
    setActiveTabBarElement: function(elementId) {
      // here we assume that at any time at least one tab bar element is active
     document.getElementsByClassName("active")[0].classList.remove("active");
     document.getElementById(elementId).classList.add("active");
    },

    settings: function(event){
      Backbone.history.navigate("settings",{
        trigger: true
      });
    }
  });

  return StructureViewSiwyt;

});
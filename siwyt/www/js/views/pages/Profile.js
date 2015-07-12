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
      document.getElementById("title").innerHTML="Profile";
      document.getElementById("back").style.display="none";

      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
      this.utente = new Utente();
    },

    id: "profile",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "swipeRight": "goToHome",
      "tap #deleteAccount": "deleteAccount",
      "tap #editData":"editData",
      "tap #saveData": "saveData"
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html(this.template(this.model.models));

      return this;
    },

    deleteAccount: function(e){
      var del = window.confirm("Sei sicuro di voler eliminare il tuo account?");
      console.log(del);
      if(del){
        this.utente.deleteAccount();
      }
    },

    editData: function(e){
      console.log("editing");
      $(".edit").removeAttr("disabled");
      $("#editData").attr("style","display:none");
      $("#saveData").attr("style","display:inline-block")

    },

    saveData: function(e){
      if(this.validateEditedData()){
        this.utente.saveData();
      }
    },

    validateEditedData: function(e){
      valid= true
       var name = document.getElementById("profileName").value;
       var surname = document.getElementById("profileSurname").value;
       var oldPass = document.getElementById("profileOldPass").value;
       var newPass = document.getElementById("profileNewPass").value;
       var confirm = document.getElementById("profileConfirm").value;
       console.log(newPass);

       if(name=="" || name=="undefined") {
            $("#errName").attr("style","display:inline-block");
            valid=false;
          }else
              $("#errName").removeAttr("style");

       if(surname=="" || surname=="undefined"){
            $("#errSurname").attr("style","display:inline-block");
            valid = false;
       } else
            $("#errSurname").removeAttr("style");

       if(!this.utente.checkPassword()) {
        $("#errPassword").attr("style","display:inline-block");
        valid = false;
       } else
          $("#errPassword").removeAttr("style");

       if( newPass!=confirm || newPass.length < 5  ){
        $("#errConfirm").attr("style","display:inline-block");
        valid=false;
      } else
          $("#errConfirm").removeAttr("style");

      return valid;
    },

    goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });

    }
  });

  return Profile;

});
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

      //nascondo o visualizzo elementi 
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
      var idUtente = localStorage.getItem('idu');
      this.utente = new Utente();
      
      //this.utente.on("resultData", this.showData, this);
      // carico i dati dell utente 
      //this.utente.requestData(idUtente);

      //this.utente.on("resultSaveDate",this.saveData, this);
      //this.utente.on("resultDeleteAccount", this.goOut, this);
      //this.utente.on("resultCheckPassword", this);
      //console.log(this.utente);
    },

    id: "profile",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "swipeRight": "goToHome",
      "tap #deleteAccount": "deleteAccount",
      "tap #editData":"editData",
      "tap #saveData": "validateEditedData",
      "tap #deleteData": "cancellChanges"
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html(this.template(this.model.models));

      return this;
    },

    goOut: function(result){
        localStorage.setItem('idu',null);
        Backbone.history.navigate("login", {
        trigger: true
      });
    },

    showData: function(result){
      if(result!=null){
          console.log(result);

      }
    },

    deleteAccount: function(e){
      var del = window.confirm("Are you sure you want to delete your account?");
      console.log(del);
      if(del)  this.utente.deleteAccount(idUtente);
    
    },

    editData: function(e){
      console.log("editing");
      this._name = document.getElementById("profileName").value;
      this._surname = document.getElementById("profileSurname").value;
      $(".edit").removeAttr("disabled");
      $("#editData").attr("style","display:none");
      $("#deleteData").attr("style","display:inline-block");
      $("#saveData").attr("style","display:inline-block");

    },

    cancellChanges: function(e){
        $("#editData").removeAttr("style");
        $("#saveData").removeAttr("style");
        $("#deleteData").removeAttr("style");
        document.getElementById("profileName").value =this._name;
        document.getElementById("profileSurname").value = this._surname;
        document.getElementById("profileOldPass").value ="";
        document.getElementById("profileNewPass").value ="";
        document.getElementById("profileConfirm").value ="";
        $(".edit").attr("disabled","disabled");
        $(".errorReg").removeAttr("style");

    },

    validateEditedData: function(e){
       var valid= true;
       var name = document.getElementById("profileName").value;
       var surname = document.getElementById("profileSurname").value;
       var oldPass = document.getElementById("profileOldPass").value;
       var newPass = document.getElementById("profileNewPass").value;
       var confirm = document.getElementById("profileConfirm").value;
       console.log(newPass);

      // controlla che il nuovo nome non sia vuoto
       if(name=="" || name=="undefined") {
            $("#errName").attr("style","display:inline-block");
            valid=false;
          }else
              $("#errName").removeAttr("style");

      // controlla che il nuovo surname non sia vuoto
       if(surname=="" || surname=="undefined"){
            $("#errSurname").attr("style","display:inline-block");
            valid = false;
       } else
            $("#errSurname").removeAttr("style");

       /// controlla che la password inserita sia uguale a quella vecchia     
       /*if(!this.utente.checkPassword(idUtente, oldPass)) {
            $("#errPassword").attr("style","display:inline-block");
            valid = false;
       } else
          $("#errPassword").removeAttr("style");*/

       // controlla che la nuova password inserita sia uguale a quella nel campo
       // conferma e che sia almeno di 5 caratteri     
       if( newPass!=confirm || newPass.length < 5  ){
        $("#errConfirm").attr("style","display:inline-block");
        valid=false;
      } else
          $("#errConfirm").removeAttr("style");

      if (valid) this.utente.saveData(idUtente, oldPass, newPass, name, surname);
    },

    goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });

    },

     saveData: function(result){
      if(result==null){
          console.log("save data error");
        }else{
            $("#editData").removeAttr("style");
            $("#saveData").attr("style","display:none");
        }
      }


  });

  return Profile;

});
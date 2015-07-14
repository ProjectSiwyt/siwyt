define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utente = require("models/Utente");
  var Utils = require("utils");
  var $ = require("jquery");



  var Register = Utils.Page.extend({

    constructorName: "Register",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.register;
      console.log("initialize register");
      document.getElementById("navigation").style.display="none";
      document.getElementById("title").innerHTML="Sign-Up";
      $("#header").removeAttr("style");
      document.getElementById("settingsMenu").style.display="none";

      this.utente= new Utente();
      this.utente.on("eventoRegister", this.sendMail, this);
      this.utente.on("resultUsername",this.doRegistration, this);
      /*var err =  $("span.errorReg");
      console.log(err);*/
      
      /*var err = document.getElementsByClassName("errorReg");//.getElementsByClassName("errorReg");
      console.log(err);
      console.log(err.length);
      for( i=0 ; i<err.length; i++){
        document.getElementsByClassName("errorReg")[i].style.display="none";
        console.log(i);
      }*/
      
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "register",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap .btn-block": "validateRegister"
    },

    render: function() {

      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));
      /*var err = $(".errorReg")//.attr("style","display:none");
      console.log(err);*/
      
      return this;
    },

    sendMail: function(result){
      console.log(result);
      this.utente.inviaMail(result.nome, result.cognome, result.username, result.mail , result.password );
      Backbone.history.navigate("login",{
        trigger: true
      });
    },

    doRegistration: function(result) {
      console.log(result);
      if(result==true)
         $("#errUsernameExist").attr("style","display:block");
      else{
        $("#errUsernameExist").removeAttr("style");
        this.utente.register(result.name, result.surname, result.username, result.email, result.password);
      }


    },

    validateRegister: function(e){
      $(".errorReg").removeAttr("style");
      var name = document.formRegister.regName.value;
      var surname = document.formRegister.regSurname.value;
      var username = document.formRegister.regUsername.value;
      var email = document.formRegister.regEmail.value;
      var password = document.formRegister.regPassword.value;
      var confirm = document.formRegister.regConfirm.value;
      var valid= true;

      var emailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;
      if (password != confirm) {
          console.log("err confirm");
          $("#errConfirm").attr("style","display:block");
          /*document.formRegister.regPassword.value = "";
          document.formRegister.regConfirm.value = "";*/
          document.formRegister.regPassword.focus();
          valid= false;
      }

      if (!emailExp.test(email) || (email == "") || (email == "undefined")) {
             console.log("err email");
             /*$("#errEmail").removeAttr("style");*/
             $("#errEmail").attr("style","display:block");
             document.formRegister.regEmail.select();
             valid = false;
          }

      if ((name == "") || (name == "undefined")) {
             console.log("err name");
             $("#errName").attr("style","display:block");
             document.formRegister.regName.select();
             valid = false;
          }/*else 
              $("#errName").removeAttr("style");*/
              

      if ((surname == "") || (surname == "undefined")) {
             console.log("err surname");
             $("#errSurname").attr("style","display:block");
             document.formRegister.regSurname.select();
             valid = false;
          }

      if ((username == "") || (surname == "undefined")) {
             console.log("err username");
             $("#errUsername").attr("style","display:block");
             document.formRegister.regUsername.select();
             valid = false;
          }
      if ((password == "") || (password.length < 5)) {
             console.log("err password");
             $("#errPassword").attr("style","display:block");
             document.formRegister.regPassword.select();
             valid = false;
          }

      if(valid) this.utente.checkUsername(name, surname, username, email, password); //this.utente.register(name, surname, username, email, password);  
    }

  });

  return Register;

});
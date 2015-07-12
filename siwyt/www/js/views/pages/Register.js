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

      document.getElementById("navigation").style.display="none";
      document.getElementById("header").style.display="none";
      /*var err =  $("span.errorReg");
      console.log(err);*/
      
      /*var err = document.getElementsByClassName("errorReg");//.getElementsByClassName("errorReg");
      console.log(err);
      console.log(err.length);
      for( i=0 ; i<err.length; i++){
        document.getElementsByClassName("errorReg")[i].style.display="none";
        console.log(i);
      }*/
      this.utente= new Utente();
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
      "tap .btn-block": "validateRegister",
    },

    render: function() {

      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));
      $("span.errorReg").css("style", "display:none");
      /*var err = $(".errorReg")//.attr("style","display:none");
      console.log(err);*/
      
      

      return this;
    },


    doRegistration: function(e) {
      ////////////// controllo se i campi sono stati inseriti correttamente e rimando a login
      if (this.validateRegister){
        this.utente.register();
      }
    },

    validateRegister: function(e){
      var name = document.formRegister.regName.value;
      var surname = document.formRegister.regSurname.value;
      var username = document.formrRegister.regUsername.value;
      var email = document.formrRegister.regEmail.value;
      var password = document.formRegister.regPassword.value;
      var confirm = document.formRegister.regConfirm.value;
      

      var emailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;
      if (password != conferma) {
           alert("La password confermata è diversa da quella scelta, controllare.");
           document.formRegister.regPassword.value = "";
           document.formRegister.regConfirm.value = "";
           document.formRegister.regPassword.focus();
           return false;}

      else if (!email_reg_exp.test(email) || (email == "") || (email == "undefined")) {
             alert("Inserire un indirizzo email alido.");
             document.formRegister.regEmail.select();
             return false;
          }
      else {   return true }
      Backbone.history.navigate("login", {
        trigger: true
      });
    }
  });

  return Register;

});
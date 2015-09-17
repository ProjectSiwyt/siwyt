define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utils = require("utils");
  var $ = require("jquery");
  var Spinner= require("spin");




  var Register = Utils.Page.extend({

    constructorName: "Register",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.register;
      console.log("initialize register");
      document.getElementById("navigation").classList.add('hide');
      document.getElementById("title").innerHTML="Sign Up";
      var header=document.getElementById('header');
      if (header.classList.contains('hide')){
          header.classList.remove('hide');
      }
      document.getElementById("settingsMenu").classList.add('hide');

      this.utente= new Utente();
      this.utente.on("eventoRegister", this.sendMail, this);
      this.utente.on("resultUsername",this.doRegistration, this);
  
      
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
      
      return this;
    },


    // quando la registrazione va a buon fine viene inviata una mail di conferma all email specificata
    sendMail: function(result){
      this.spinner.stop();
      if(result){
      console.log("registrazione", result);
      this.utente.inviaMail(result.nome, result.cognome, result.username, result.mail , result.password );
      Backbone.history.navigate("login",{
        trigger: true
      });
    }
    },


    // se lo username scelto è disponibile e valido viene effettuata la registrazinoe
    doRegistration: function(result) {
      console.log(result);
      if(result==true){
          this.spinner.stop();
         $("#errUsernameExist").attr("style","display:block");
       }
      else{
        $("#errUsernameExist").removeAttr("style");
        this.utente.register(result.name, result.surname, result.username, result.email, result.password);
      }
    },

    // viene verificata la validità dei dati immessi nella form di registrazione
    validateRegister: function(e){
      $(".errorReg").removeAttr("style");
      var name = document.formRegister.regName.value;
      var surname = document.formRegister.regSurname.value;
      var username = document.formRegister.regUsername.value;
      var email = document.formRegister.regEmail.value;
      var password = document.formRegister.regPassword.value;
      var confirm = document.formRegister.regConfirm.value;
      var valid= true;
      var THIS = this;
      var emailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;
      
      if (password != confirm || confirm=="") {
          $("#errConfirm").attr("style","display:block");
          $("#regConfirm").attr("style","border: 1px solid #ed7800");
          document.formRegister.regPassword.focus();
          valid= false;
      }

      if (!emailExp.test(email) || (email == "") || (email == "undefined")) {
             $("#errEmail").attr("style","display:block");
             $("#regEmail").attr("style","border: 1px solid #ed7800");
             document.formRegister.regEmail.select();
             valid = false;
          }

      if ((name == "") || (name == "undefined")) {
             $("#errName").attr("style","display:block");
             $("#regName").attr("style","border: 1px solid #ed7800");
             document.formRegister.regName.select();
             valid = false;
          }
      if ((surname == "") || (surname == "undefined")) {
             $("#errSurname").attr("style","display:block");
             $("#regSurname").attr("style","border: 1px solid #ed7800");
             document.formRegister.regSurname.select();
             valid = false;
          }

      if ((username == "") || (surname == "undefined")) {
             $("#errUsername").attr("style","display:block");
             $("#regUsername").attr("style","border: 1px solid #ed7800");
             document.formRegister.regUsername.select();
             valid = false;
          }
      if ((password == "") || (password.length < 5)) {
             $("#errPassword").attr("style","display:block");
             $("#regPassword").attr("style","border: 1px solid #ed7800");
             document.formRegister.regPassword.select();
             valid = false;
          }

          // se i dati sono validi controllo che lo username scelto sia disponibile
      if(valid){
        setTimeout(function(){THIS.spinner.spin(document.body);},50);
        this.utente.checkUsername(name, surname, username, email, password); //this.utente.register(name, surname, username, email, password);  
    }
  },

  });

  return Register;

});
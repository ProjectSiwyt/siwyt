define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utils = require("utils");
  var Spinner= require("spin");


  var Login = Utils.Page.extend({

    constructorName: "Login",

    model: Utente,

    initialize: function() {
      
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.login;
      //console.log("inizalize login");
      //console.log(this.sendemail);
      $(".errorReg").removeAttr("style");
      document.getElementById("header").classList.add('hide');
      document.getElementById("navigation").classList.add('hide');
      this.utente = new Utente();
      this.utente.on("resultLogin",this.login, this);
      this.utente.on("mailSent", this.showMessageMail, this );

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

    id: "login",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #btn_login": "validateLogin",
      "tap #sign_up": "goToRegister",
      "keyup":"controlSubmit",
      "tap #recover": "recover",
      "tap #back_login": "recover",
      "tap #btn_recover": "sendRecoverMail"
    },

    render: function() {
      //console.log("render login");
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));
      //console.log(this);
      return this;
    },

 
    login:function(result){
      console.log(result);
      this.spinner.stop(); 
        if(result!=null){

           Backbone.history.navigate("activePushNotification", {
              trigger: true
            });
        }
        else{
          $("#loginerror").attr("style","display:inline-block");
          $("#logUsername").attr("style","border: 1px solid #ed7800");
          $("#logPassword").attr("style","border: 1px solid #ed7800");
        }
            
      },

    controlSubmit: function(e){
        if(e.which === 13)
        this.validateLogin();
    },


     showMessageMail: function(result){
      if(result){
        $("#emailSent").attr("style", "display:block");
      }

     } ,

    validateLogin: function(e) {
      var THIS = this;
      var username = document.formLogin.logUsername.value;
      var password = document.formLogin.logPassword.value;
      this.spinner.spin(document.body);
      //setTimeout(function(){THIS.spinner.spin(document.body);},50);
      this.utente.login(username,password);
    },

    recover: function(e){
      console.log("recover");
      document.getElementById("formLogin").classList.toggle('hide');
      document.getElementById("btn_login").classList.toggle('hide');
      document.getElementById("btn_recover").classList.toggle('hide');
      document.getElementById("recover").classList.toggle('hide');
      document.getElementById("formRecover").classList.toggle('hide');
      document.getElementById("sign_up").classList.toggle('hide');
      document.getElementById("back_login").classList.toggle('hide');
    },

    sendRecoverMail: function(){
      var user = document.getElementById("recoverUsername").value;
      console.log(user);
      this.utente.recoverPass(user);
    },
  
  goToRegister: function(e) {
      Backbone.history.navigate("register", {
        trigger: true
      });
    }

  });
  return Login;

});
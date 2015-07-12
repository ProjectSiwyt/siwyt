define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utente = require("models/Utente");
  var Utils = require("utils");


  var Login = Utils.Page.extend({

    constructorName: "Login",

    model: Utente,

    initialize: function() {
      
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.login;
      console.log("inizalize login");
      document.getElementById("navigation").style.display="none";
      document.getElementById("header").style.display="none";
      this.utente = new Utente();
      this.utente.on("resultLogin",this.login, this);
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
      "tap #sign_up": "goToRegister"
    },

    render: function() {
      console.log("render login");
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));
      console.log(this);
      return this;
    },

    /*doLogin: function(e){
        if(this.validateLogin()){ 
            Backbone.history.navigate("homeSiwyt", {
            trigger: true
              });

        }

    },*/
    login:function(result){
      //if(result>0){
          Backbone.history.navigate("homeSiwyt", {
            trigger: true
              });
      },
    

    validateLogin: function(e) {
      //debugger;
      //e.preventDefault();
      var emailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;
      var email = document.formLogin.logEmail.value;
      var password = document.formLogin.logPassword.value;
      var valid =true;

      if (!emailExp.test(email) || (email == "") || (email == "undefined")) {
             console.log("err email");
             /*$("#errEmail").removeAttr("style");*/
             $("#loginerror").attr("style","display:block");
             document.formRegister.regEmail.select();
              valid =false;
          }else
              $("loginerror").removeAttr("style");

      if ((password == "") || (password.length < 5)) {
             console.log("err password");
             $("#loginerror").attr("style","display:block");
             document.formRegister.regPassword.select();
             valid = false;
          }else 
              $("#loginerror").removeAttr("style");

      if(valid) this.utente.login(email,password);

    },
  
  goToRegister: function(e) {
      Backbone.history.navigate("register", {
        trigger: true
      });
    }

  });
  return Login;

});
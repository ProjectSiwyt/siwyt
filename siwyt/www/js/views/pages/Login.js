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
      console.log(this.sendemail);
      $(".errorReg").removeAttr("style");
      document.getElementById("navigation").style.display="none";
      document.getElementById("header").style.display="none";
      this.utente = new Utente();
      this.utente.on("resultLogin",this.login, this);
      this.utente.on("mailSent", this.showMessageMail, this );
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
      console.log(result);
        if(result!=null){
          Backbone.history.navigate("homeSiwyt", {
              trigger: true
            });
        }
        else{
          $("#loginerror").attr("style","display:inline-block");}
            
      },


     showMessageMail: function(result){
      if(result){
        console.log("hfhvfVHFVHòFEHfhvò");
        $("#emailSent").attr("style", " display:block");
      }

     } ,

    validateLogin: function(e) {
      var username = document.formLogin.logUsername.value;
      var password = document.formLogin.logPassword.value;

      this.utente.login(username,password);
    },
  
  goToRegister: function(e) {
      Backbone.history.navigate("register", {
        trigger: true
      });
    }

  });
  return Login;

});
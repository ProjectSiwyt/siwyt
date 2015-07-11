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


    validateLogin: function(e) {
      // ***************   con baasBox fare la parte di validazione dati e stampare errore o andare alla home   *****************************
      //debugger;
      //e.preventDefault();
    /*  var formValues = {
            email: $('#email').val(),
            password: $('#password').val()
        };*/

  /*      $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                console.log(["Login request details: ", data]);
               
                if(data.error) {  // If there is an error, show the error messages
                    $('.loginerror').attr("style","display:block");
                }
                else { // If not, send them back to the home page
                    window.location.replace('#');
                }
            }
        });*/
    
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
    },
  
  goToRegister: function(e) {
      Backbone.history.navigate("register", {
        trigger: true
      });
    }

  });
  return Login;

});
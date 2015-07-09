define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utils = require("utils");


  var CreateBacheca = Utils.Page.extend({

    constructorName: "CreateBacheca",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.createBacheca;
      document.getElementById("navigation").style.display="none";      
      document.getElementById("title").innerHTML="Create Noticeboard"
      
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "createBacheca",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #submit": "goToBacheca",
      "tap #addMembers": "goToAddContacts"
    },

    render: function() {
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));

      return this;
    },

    goToBacheca: function(e) {
      Backbone.history.navigate("newBacheca/"+document.getElementById("idBacheca").value, {
        trigger: true
      });
    },
    goToAddContacts: function(e) {
      Backbone.history.navigate("addContacts", {
        trigger: true
      });
    }
  });

  return CreateBacheca;

});
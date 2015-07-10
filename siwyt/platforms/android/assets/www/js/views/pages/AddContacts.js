define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utils = require("utils");


  var AddContacts = Utils.Page.extend({

    constructorName: "AddContacts",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structureAddContacts;
      this.utente = new Utente();
      this.utente.on("nomeContatti",this.appendContacts, this);
      //L'id dell'utente è statico ci andrebbe invece l'id dell'utente loggato
      this.utente.listContacts("ad658365-3cf9-4515-a348-a7105bb3d48f");
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "addcontacts",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #submitAddContacts": "goToCreateNoticeboard",
      "tap #addRemoveMembers": "contactsManagement"
    },

    appendContacts: function(){

    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html(this.template(this.model.models));

      return this;
    },

    goToCreateNoticeboard: function(e) {
      alert("aggiornare membri Bacheca");
      Backbone.history.navigate("createBacheca", {
        trigger: true
      });
    },

    contactsManagement: function(e){
      if(e.target.innerHTML=='+'){
        e.target.innerHTML='-';
      }
      else{
        e.target.innerHTML='+';
      }
    }
  });

  return AddContacts;

});
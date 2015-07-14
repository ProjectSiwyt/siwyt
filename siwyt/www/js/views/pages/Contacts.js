define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Utente = require("models/Utente");
  var Utils = require("utils");
  var Utenti = require("collections/Utenti");
  var ShowListContacts = require("views/pages/ShowListContacts");


  var Contacts = Utils.Page.extend({

    constructorName: "Contacts",
    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structureContacts;
      console.log("initialize template contacts");
      /*document.getElementById("navigation").style.display="inlne-block";
      document.getElementById("header").style.display="inherit";*/
      $("#navigation , #header  , #settingsMenu").removeAttr("style");
 
      document.getElementById("title").innerHTML="Contacts";
      document.getElementById("back").style.display="none";
      this.utente = new Utente();
      this.utente.on("listContacts", this.showListContact, this);
      this.utente.listContacts(localStorage.getItem("idu"));

      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "contacts",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "swipeLeft": "goToHome",
      "tap .add_to_board": "add_to_board",
      "tap .remove_contact": "remove_contact"
    },

    render: function() {
      $(this.el).html(this.template());

      return this;
    },

    showListContact: function(result){
      var contacts = new Utenti();
      contacts.add(result);
      console.log(contacts);
      console.log("contattiiiii: "+contacts);
      this.subView = (new ShowListContacts({collection: contacts})).render().el;
      console.log("subview " +this.subView);
        
      document.getElementById("contactsContent").appendChild(this.subView);
    },

    goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
    },

  add_to_board: function(e) {
      ///////// aggiungi a bacheca 
      var contact = $(e.currentTarget).attr("id")[0];
      console.log(contact);
      /// query per aggiungere contatto a bacheca

    },
    
    remove_contact: function(e) {
      ///////// rimuovi contatto dalla lista contatti
      var contact = $(e.currentTarget).attr("id")[0];
      console.log(contact);
      ///////// query per rimozione contatto
    }
  });

  return Contacts;

});
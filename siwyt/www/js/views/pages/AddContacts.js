define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utenti = require("collections/Utenti");
  var Utils = require("utils");
  var ShowPostitsNoticeboard= require("views/pages/ShowPostitsNoticeboard");
  var ShowListContacts= require("views/pages/ShowListContacts");

  var AddContacts = Utils.Page.extend({

    constructorName: "AddContacts",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structureAddContacts;
      this.utente = new Utente();
      this.utente.on("listContacts",this.appendContacts, this);
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

    appendContacts: function(result){
      console.log(result);
      var b= new Utenti();
      for (var i=0; i<result.length; i++){
          b.add(result[i]);
          console.log(result[i]);
      }
      this.subView = (new ShowListContacts({collection: b})).render().el;
      console.log(this.subView);
        //quando i dati vengono caricati faccio la render della pagina contenente la lista delle bacheche
      //$('#boardContent').append(this.subView);
      document.getElementById("contactsContent").appendChild(this.subView);
    },

    render: function() {
      $(this.el).html(this.template());
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
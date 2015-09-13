define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Bacheche = require("collections/Bacheche");
  var Utils = require("utils");
  var Utente = require("models/Utente");

  var ShowListNoticeboardsContacts = Utils.Page.extend({

    constructorName: "ShowListNoticeboardsContacts",

    model: Bacheca,

    initialize: function() {
      // load the precompiled template
      this.bacheca = new Bacheca();
      this.template = Utils.templates.contentListBoardsContacts;
      this.utente = new Utente();
      this.bacheca.on("utenteAggiunto", this.showChecked, this);

      
     // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    //id: "showlistnoticeboards",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap .rigabacheca": "addContactToBacheca",
    },

    render: function() {
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
    },

    showChecked: function(result){
      if(result){

        var item = document.getElementsByClassName("current")[0];
        console.log("contattoAggiunto");
        console.log(item);
        var i = item.childNodes[3];
        i.classList.toggle('fa-square-o');
        i.classList.toggle('fa-check-square-o');
        this.utente.inviaMailContattoAggiunto(localStorage.getItem("nameLogged"), localStorage.getItem("surnameLogged"), result);

      }
    },

    addContactToBacheca: function(e){
      var idb = e.currentTarget.getAttribute("data-id");
      e.currentTarget.classList.toggle("current");
      console.log(idb);
      var idu = sessionStorage.getItem("idUserToAdd");
      this.bacheca.aggiungiUtenteBacheca(idu, idb);
      

      //});

    
    }
  });

  return ShowListNoticeboardsContacts;

});
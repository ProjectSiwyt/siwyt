define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utenti = require("collections/Utenti");
  var Utils = require("utils");
  var Contatto = require("models/Contatto");

  var ShowListContactsSearch = Utils.Page.extend({

    constructorName: "ShowListContactsSearch",

    //model: Bacheca,
    model: Utente,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.contentListContactsSearch;
      this.contatto = new Contatto();
      this.utente = new Utente();
      this.contatto.on("resultAggiungiContatto", this.showDone, this);
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "showlistcontactsSearch",
    className: "popup",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      //"tap .rigabacheca": "goToBacheca",
      "swipeLeft": "goToHome",
      "tap .addContact": "addContact"

    },

    render: function() {
      //debugger;
      console.log(this.collection);
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
    },

    addContact: function(e){
      var id2 = e.currentTarget.parentNode.id;
      console.log(id2);
      var id1 = localStorage.getItem("idu");
      //this.contatto.aggiungiContattoConNotifica(id1, id2);
      this.contatto.aggiungiContatto(id1, id2);
    },

    showDone: function(result){
      if(result){
        console.log("showDone", result);
        var item = document.getElementById(result);
        var span = item.childNodes[1];
        var i = span.firstChild;
        /*console.log("item ",item);
        console.log("span ",span);
        console.log("i --> ",i);*/
        span.classList.toggle('addContact');
        i.classList.toggle('fa-user-plus');
        i.classList.toggle('fa-check');
        $("#"+result).removeAttr("id");
        
      }
    },

  
     goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
    }
  });

  return ShowListContactsSearch;

});
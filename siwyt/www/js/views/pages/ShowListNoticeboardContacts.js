define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Bacheche = require("collections/Bacheche");
  var Utils = require("utils");

  var ShowListNoticeboardsContacts = Utils.Page.extend({

    constructorName: "ShowListNoticeboardsContacts",

    model: Bacheca,

    initialize: function() {
      // load the precompiled template
      this.bacheca = new Bacheca();
      this.template = Utils.templates.contentListBoardsContacts;

      this.bacheca.on("utenteAggiunto", this.showChecked);

      
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

        var item = document.getElementsByClassName("current");
        console.log("cpntattoAggiunto");
        console.log(item);
        debugger
        var i = span.firstChild;
        i.classList.toggle('fa-user-plus');
        i.classList.toggle('fa-check');
      }
    },

    addContactToBacheca: function(e){
      var idb = e.currentTarget.getAttribute("data-id");
      e.currentTarget.classList.toggle("current");
      console.log(idb);
      var idu = sessionStorage.getItem("idUserToAdd");
      /*console.log(idb);
      console.log(idu);*/
      //this.bacheca.aggiungiMembro();
      /*var a = new Array();
      a[0]= idu;*/
      this.bacheca.aggiungiUtenteBacheca(idu, idb);
      

      //});

    
    }
  });

  return ShowListNoticeboardsContacts;

});
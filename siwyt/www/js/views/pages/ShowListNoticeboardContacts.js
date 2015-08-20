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


    addContactToBacheca: function(e){
      var idb = e.currentTarget.getAttribute("data-id");
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
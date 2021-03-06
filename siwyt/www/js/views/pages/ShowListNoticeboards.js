define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Bacheche = require("collections/Bacheche");
  var Utils = require("utils");

  var showListNoticeboards = Utils.Page.extend({

    constructorName: "showListNoticeboards",

    model: Bacheca,

    initialize: function(template,ruolo) {
      // load the precompiled template
      this.ruolo=ruolo;
      this.template = Utils.templates.contentListBoards;
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
    className: "i-12 table-view",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap .rigabacheca": "goToBacheca",
    },

    render: function() {
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
    },

    goToBacheca: function(e){
      console.log(this.model);
      Backbone.history.navigate("bacheca/"+e.currentTarget.id+"/"+this.ruolo, {
        trigger: true
      });
    }
  });

  return showListNoticeboards;

});
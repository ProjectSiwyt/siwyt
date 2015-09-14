define(function(require) {

  var Backbone = require("backbone");
  var Postit = require("models/Postit");
  var Utils = require("utils");

  var showPostit = Utils.Page.extend({

    constructorName: "showPostit",

    model: Postit,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.contentPostit;
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
    className: "div",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      //"tap .rigabacheca": "goToBacheca",
    },

    render: function() {
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
    },

    goToBacheca: function(e){
      console.log(this.model);
      Backbone.history.navigate("bacheca/"+e.currentTarget.id, {
        trigger: true
      });
    }
  });

  return showPostit;

});
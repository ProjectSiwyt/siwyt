define(function(require) {

  var Backbone = require("backbone");
  var Postit = require("models/Postit");
  var Postits = require("collections/Postits");
  var Utils = require("utils");

  var ShowPostitsNoticeboard = Utils.Page.extend({

    constructorName: "ShowPostitsNoticeboard",

    model: Postit,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.contentListPostits;

      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "showpostitsnoticeboard",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #popupPostit": "popupManagement",

    },

    render: function() {
      console.log(this.collection);
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
    },
    popupManagement: function(e){
      var popup= document.getElementById("popupPostit"+e.currentTarget.id);
      console.log(popup);
      if(popup.style.display=="none"){
          popup.style.display="block";
      }
      else{
        popup.style.display="none";
      }
      console.log(e.currentTarget.id);
    }

  });

  return ShowPostitsNoticeboard;

});
define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Utils = require("utils");

  var NoticeboardManagement = Utils.Page.extend({

    constructorName: "MyView",

    model: Bacheca,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.noticeboardManagement;

      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "noticeboardManagement",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

  });

  return NoticeboardManagement;

});
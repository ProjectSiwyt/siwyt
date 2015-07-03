define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Bacheca = require("models/Bacheca");
  var Utils = require("utils");
  var $ = require("jquery");

  var HomeSiwyt = Utils.Page.extend({

    constructorName: "HomeSiwyt",

    model: Bacheca,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.homeSiwyt;
      /*
      $("body").on("swipeLeft",function(){
        console.log("CIAO");
      });                       
      */
      /*
      var prova = document.getElementById("content");
      prova.addEventListener("tap", go);
      function go(event){
        Backbone.history.navigate("contacts", {
        trigger: true
      });
      };
      */
      // here we can register to inTheDOM or removing events
      //this.listenTo(this, "inTheDOM", function() {
      //  console.log("CCCCCCCCCC");
      // $('#content').on("swipe", this.goToContacts);
      //});
      //this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "homeSiwyt",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      //"tap": "goToContacts",
      "tap .rigabacheca": "goToBacheca",
      "tap #new": "goToCreateBacheca",
      "swipeLeft": "goToContacts"
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html(this.template(this.model.models));

      return this;
    },
    /*
    swipeControls: function(e) {
        if e.type == 'right'{
            this.goToProfile()
        }
        else{
            this.goToContacts()
        }
    },
    */

    goToContacts: function(e) {
      $(".active").attr("class","tab-item");
      $("#contacts").attr("class","tab-item active");
      Backbone.history.navigate("contacts", {
        trigger: true
      });
    },
    goToCreateBacheca: function(e){
      Backbone.history.navigate("createBacheca", {
        trigger: true
      });
    },
    goToBacheca: function(e){
      Backbone.history.navigate("bacheca/"+e.currentTarget.id, {
        trigger: true
      });
    }
    
  });

  return HomeSiwyt;

});
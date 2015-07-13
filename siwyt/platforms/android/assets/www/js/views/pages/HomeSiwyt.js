define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Bacheche = require("collections/Bacheche");
  var Bacheca = require("models/Bacheca");
  var Utils = require("utils");
  var ShowListNoticeboards = require("views/pages/ShowListNoticeboards");
  var $ = require("jquery");

  var HomeSiwyt = Utils.Page.extend({

    constructorName: "HomeSiwyt",

    model: Bacheca,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structureHomeSiwyt;
      $("#navigation").removeAttr("style");
      $("#header").removeAttr("style");
      $("#back").attr("style","display:none");
      spinner.spin();
      document.getElementById("title").innerHTML="Noticeboards"
      this.bacheca=new Bacheca();
      this.bacheca.on("eventoidbacheche", this.calcola,this);
      this.bacheca.on("eventolistabacheche", this.appendNoticeboards,this);
      this.bacheca.listaIdBacheche();
    },

    id: "homeSiwyt",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      //"tap": "goToContacts",
      "tap #new": "goToCreateBacheca",
      "swipeLeft": "goToProfile",
      "swipeRight": "goToContacts"
    },
    calcola: function(result){
      this.bacheca.listaDatiBacheche(result);
    },
    appendNoticeboards: function(result){
    //console.log(result);
      var b= new Bacheche();
      b.add(result);
      console.log(b);
      this.subView = (new ShowListNoticeboards({collection: b})).render().el;
      console.log(this.subView);
      document.getElementById("noticeboardsList").appendChild(this.subView);
    },
    render: function() {
      spinner.stop();
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));

      return this;
    },
    goToContacts: function(e) {
      Backbone.history.navigate("contacts", {
        trigger: true
      });
    },
    goToProfile: function(e) {
      Backbone.history.navigate("profile", {
        trigger: true
      });
    },
    goToCreateBacheca: function(e){
      Backbone.history.navigate("createBacheca", {
        trigger: true
      });
    },
    
  });

  return HomeSiwyt;

});
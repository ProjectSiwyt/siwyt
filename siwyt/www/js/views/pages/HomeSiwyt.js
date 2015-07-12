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
      var dati = new Bacheche();
      dati.fetch().done(function(){
        this.subView = (new ShowListNoticeboards({collection: dati})).render().el;
        //quando i dati vengono caricati faccio la render della pagina contenente la lista delle bacheche
        $('#noticeboardsList').append(this.subView);
      });
      
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
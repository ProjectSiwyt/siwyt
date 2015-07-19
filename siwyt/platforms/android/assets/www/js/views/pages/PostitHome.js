define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Commenti = require("collections/Commenti");
  var Commento = require("models/Commento");
  var Utils = require("utils");
  var ShowListComments = require("views/pages/ShowListComments");

  var PostitHome = Utils.Page.extend({

    constructorName: "PostitHome",

    model: Commento,

    initialize: function(idp, idb) {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structurePostit;
      this.idp=idp;
      this.idb=idb;
      
      document.getElementById("navigation").classList.add('hide');
      document.getElementById("title").classList.add('hide');
      var header= document.getElementById("header");
      var settings = document.getElementById("settingsMenu");
      var back=document.getElementById("back");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      }
      if (settings.classList.contains('hide')){
        settings.classList.remove('hide');
      }
      if(back.classList.contains('hide')){
        back.classList.remove('hide');
      }
     
      spinner.spin();
      this.commento=new Commento();
      this.commento.on("elencoCommenti", this.appendComments, this);
      this.commento.on("aggiuntoCommento", this.appendComments, this);
      

    },

    id: "postitHome",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #submitComment":"submit"
      //"tap": "goToContacts",
      
    },
    caricaDati: function(){
        this.commento.elencoCommentiPostit(this.idp);
    },
    appendComments: function(result){
        var commenti=new Commenti();
        commenti.add(result);
        this.subView = (new ShowListComments({collection: commenti})).render().el;
      console.log(this.subView);
      document.getElementById("postitContent").appendChild(this.subView);
    },
    submit: function(e){
      this.commento.aggiungiCommento(this.idp, document.getElementById("textComment").value, localStorage.getItem("idu"));
    },
    render: function() {
      spinner.stop();
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));

      return this;
    },
    goToBacheca: function(e) {
      Backbone.history.navigate("bacheca/"+this.idb, {
        trigger: true
      });
    }
    
  });

  return PostitHome;

});
define(function(require) {

  var Backbone = require("backbone");
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
      var navigation= document.getElementById("navigation");
      var header= document.getElementById("header");
      var settings = document.getElementById("settingsMenu");
      var title = document.getElementById("title");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      }
      if (navigation.classList.contains('hide')){
        navigation.classList.remove('hide');
      };
      if (settings.classList.contains('hide')){
        settings.classList.remove('hide');
      };
      if (title.classList.contains('hide')){
        title.classList.remove('hide');
      }
      document.getElementById("back").classList.add('hide');
      title.innerHTML="Noticeboards";
      this.bacheca=new Bacheca();
      this.bacheca.on("bachecheutente", this.appendNoticeboardsUsers,this);
      this.bacheca.on("bachecheamministratore", this.appendNoticeboardsManager,this);
      this.bacheca.on("bachecheresponsabile", this.appendNoticeboardsAdmins,this);
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
    caricaDati: function(){
      this.bacheca.listaIdBachecheAmministratore();
    },
    appendNoticeboardsUsers: function(result){
      console.log(result);
      var b= new Bacheche();
      console.log(b);
      b.add(result);
      console.log(b);
      this.subView = (new ShowListNoticeboards({collection: b},'user')).render().el;
      console.log(this.subView);
      document.getElementById("noticeboardsList").appendChild(this.subView);
      this.trigger("stop");
    },
     appendNoticeboardsAdmins: function(result){
      console.log("noticeboardadmin");
      console.log(result);
      var b= new Bacheche();
      b.add(result);
      console.log(b);
      this.subView = (new ShowListNoticeboards({collection: b},'admin')).render().el;
      console.log(this.subView);
      document.getElementById("noticeboardsList").appendChild(this.subView);
      this.bacheca.listaIdBachecheUtente();
      
    },
     appendNoticeboardsManager: function(result){
      console.log(result);
      var b= new Bacheche();
      b.add(result);
      console.log(b);
      this.subView = (new ShowListNoticeboards({collection: b}, 'manager')).render().el;
      console.log(this.subView);
      document.getElementById("noticeboardsList").appendChild(this.subView);
      this.bacheca.listaIdBachecheResponsabile();
    },
    render: function() {
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
      localStorage.removeItem('utenti');
      localStorage.removeItem('responsabili');
      localStorage.removeItem('titolo');
      Backbone.history.navigate("createBacheca", {
        trigger: true
      });
    },
    
  });

  return HomeSiwyt;

});
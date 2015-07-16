define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utils = require("utils");
  var Bacheca= require("models/Bacheca");
  var Bacheche = require("collections/Bacheche");
  var Utenti = require("collections/Utenti");
  var ShowListMembers= require("views/pages/ShowListMembers");
  var ShowListUsers= require("views/pages/ShowListUsers");
  var ShowListAdmins= require("views/pages/ShowListAdmins");


  var CreateBacheca = Utils.Page.extend({

    constructorName: "CreateBacheca",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structureCreateBoard;
      document.getElementById("navigation").classList.add('hide');
      var header= document.getElementById("header");
      var back= document.getElementById("back");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      } 
      if (back.classList.contains('hide')){
        back.classList.remove('hide');
      } 
      document.getElementById("title").innerHTML="Create Noticeboard"
      this.bacheca=new Bacheca();
      this.bacheca.on("salvataggiobacheca", this.salvaAmministatore, this);
      this.bacheca.on("salvataggioAmministratore", this.salvaResponsabili, this);
      this.bacheca.on("salvataggioResponsabili", this.salvaMembri, this);
      this.bacheca.on("salvataggioUtenti", this.goToBacheca, this);
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "createBacheca",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #submit": "salva",
      "tap #addMembers": "goToAddContacts"
    },

    render: function() {
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));

      return this;
    },
    caricaMembri: function(){
      console.log("caricaMembri");
        var o1=new Object();
        o1.nome=localStorage.getItem('nameLogged');
        o1.cognome=localStorage.getItem('surnameLogged');
        var a = new Array();
        a[0]=o1;
        var b=new Utenti();
        b.add(a);

        console.log(b);
        this.subview1=(new ShowListMembers({collection: b})).render().el;
        document.getElementById("membri").appendChild(this.subview1);
        var responsabili = localStorage.getItem('responsabili');
        if (responsabili!=null){
          var r= new Utenti();
          r.add(responsabili);
          this.subview2=(new ShowListAdmins({collection: b})).render().el;
        document.getElementById("membri").appendChild(this.subview2);
        }
        var users = localStorage.getItem('utenti');
        if (users!=null){
          var u =new Utenti();
          u.add(JSON.parse(users));
          console.log(u);
          this.subview2=(new ShowListUsers({collection: u})).render().el;
        document.getElementById("membri").appendChild(this.subview2);
        }
    },
    salva: function(){
      this.bacheca.salvaBacheca(document.getElementById("nomeBacheca").value);
    },
    salvaAmministatore: function(res){
      console.log(res);
      this.idb=res.id;
      this.idu=localStorage.getItem("idu");
      this.bacheca.salvaAmministratore(this.idu, this.idb);
      //per provare ho salvato anche in utenti
      var a = new Array();
      var o1 = new Object();
      o1.idu=this.idu
      a[0]= o1;
      var o2 = new Object();
      o2.idu="d430c8b0-e0e7-4f9b-ba9b-9a94173fb613";
      a[1]=o2;
      this.bacheca.salvaUtenti(a, this.idb);
    },
    salvaResponsabili: function(res){
      //responsabili è la lista dei responsabili
      //this.bacheca.salvaResponsabili(responsabili, this.idb);
    },
    salvaMembri: function(res){
      //utenti è la lista degli utenti non responsabili
      this.bacheca.salvaUtenti(utenti, this.idb);
    },
    goToBacheca: function(res) {
      console.log("entra");
      localStorage.removeItem("utenti");
      Backbone.history.navigate("bacheca/"+this.idb, {
        trigger: true
      });
    },
    goToAddContacts: function(e) {
      Backbone.history.navigate("addContacts/"+this.id+"/new", {
        trigger: true
      });
    }
  });

  return CreateBacheca;

});
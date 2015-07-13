define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Utils = require("utils");

  var NoticeboardManagement = Utils.Page.extend({

    constructorName: "NoticeboardManagement",

    model: Bacheca,
    idb: null,

    initialize: function(idb) {
      document.getElementById("title").innerHTML="Board Management";
      document.getElementById("header").removeAttribute("style");
      document.getElementById("back").removeAttribute("style");
      this.idb=idb;
      // load the precompiled template
      this.template = Utils.templates.structureBoardManagement;
      this.bacheca=new Bacheca();
      this.bacheca.on("eventomodificaTitolo", this.salvaTitolo, this); 
      this.bacheca.on("eventoidbacheche", this.calcola, this);
      this.bacheca.on("eventolistabacheche", this.appendMembers, this);
      this.bacheca.listaIdMembriDiUnaBacheca();

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
    salvaTitolo: function(res){
        console.log(res);
        Backbone.history.navigate("bacheca/"+this.idb, {
            trigger: true
        });
    },
    //ricevuti gli id degli utenti della bacheca corrente richiamo una query per ottenere tutti i dati degli utenti
    calcola: function (res){
        this.bacheca.listaDatiMembriDiUnaBacheca();
    },
    appendMembers: function(result){
    //console.log(result);
      var b= new Utenti();
      b.add(result);
      console.log(b);
      this.subView = (new ShowListMembers({collection: b})).render().el;
      console.log(this.subView);
      document.getElementById("membri").appendChild(this.subView);
    },
    events: {
      "tap #submitUpdate": "update"
    },
    update: function(e){
        this.bacheca.modificaTitolo(this.idb, document.getElementById("titleBacheca").value);        
    },
    render: function() {
      $(this.el).html(this.template);
      return this;
    },

  });

  return NoticeboardManagement;

});
define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Utils = require("utils");
  var Utenti = require("collections/Utenti");
  var ShowListMembers = require("views/pages/ShowListMembers");
    var ShowListAdmins = require("views/pages/ShowListAdmins");
      var ShowListUsers = require("views/pages/ShowListUsers");
  var NoticeboardManagement = Utils.Page.extend({

    constructorName: "NoticeboardManagement",

    model: Bacheca,
    idb: null,

    initialize: function(idb) {
      document.getElementById("title").innerHTML="Board Management";
      var header= document.getElementById("header");
      var back=document.getElementById("back");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      }
      if (back.classList.contains('hide')){
        back.classList.remove('hide');
      } 

      this.idb=idb;
      // load the precompiled template
      this.template = Utils.templates.structureBoardManagement;
      this.bacheca=new Bacheca();

      this.bacheca.on("eventomodificaTitolo", this.salvaTitolo, this); 
      //mi metto in ascolto dell'evento che mi ritorna i dati dell'amministatore
      this.bacheca.on("datiAmministratore", this.appendManager, this);
      //mi metto in ascolto dell'evento che mi ritorna i dati dei responsabili
      this.bacheca.on("datiResponsabili", this.appendAdmin, this);
      //mi metto in ascolto dell'evento che mi ritorna i dati degli utenti
      this.bacheca.on("datiMembri", this.appendUsers, this);

      this.bacheca.on("datiBacheca", this.setTitle, this);
      this.bacheca.noticeboardData(this.idb);
      //this.bacheca.idAmministratore(this.idb);

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
          this.appendUsers();
          
        }
        else{
           this.bacheca.listaIdResponsabiliDiUnaBacheca(this.idb);   
        }

       
    },
    setTitle: function(res){
        document.getElementById("titleBacheca").value=res[0].nome;
    },
    salvaTitolo: function(res){
        console.log(res);
        Backbone.history.navigate("bacheca/"+this.idb, {
            trigger: true
        });
    },
    appendManager: function(result){
    console.log(result);
      var b= new Utenti();
      b.add(result);
      this.subView = (new ShowListMembers({collection: b})).render().el;
      console.log(this.subView);
      document.getElementById("membri").appendChild(this.subView);
      this.bacheca.listaIdResponsabiliDiUnaBacheca(this.idb);
    },
    appendAdmin: function(result){
    console.log(result);
      var b= new Utenti();
      b.add(result);
      this.subView = (new ShowListAdmins({collection: b})).render().el;
      console.log(this.subView);
      document.getElementById("membri").appendChild(this.subView);
      var users = localStorage.getItem('utenti');
      if (users!=null){
            var u =new Utenti();
            u.add(JSON.parse(users));
            console.log(u);
            this.subview3=(new ShowListUsers({collection: u})).render().el;
            document.getElementById("membri").appendChild(this.subview3);
      }
      else{
        this.bacheca.listaIdMembriDiUnaBacheca(this.idb);
      }
    },
    appendUsers: function(result){
    console.log(result);
      var b= new Utenti();
      b.add(result);
      this.subView = (new ShowListUsers({collection: b})).render().el;
      console.log(this.subView);
      document.getElementById("membri").appendChild(this.subView);
    },
    events: {
      "tap #submitUpdate": "update",
      "tap #addMembers": "goToAddContacts" 
    },
    goToAddContacts: function(){
      console.log("entrato");
        Backbone.history.navigate("addContacts/"+this.id+"/"+this.idb, {
        trigger: true
      });
    },
    update: function(e){
        this.bacheca.modificaTitolo(this.idb, document.getElementById("titleBacheca").value);        
        localStorage.removeItem("responsabili");
        localStorage.removeItem("utenti");
    },
    render: function() {
      $(this.el).html(this.template);
      return this;
    },

  });

  return NoticeboardManagement;

});
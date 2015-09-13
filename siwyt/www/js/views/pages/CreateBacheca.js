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
      var settings = document.getElementById("settingsMenu");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      } 
      if (back.classList.contains('hide')){
        back.classList.remove('hide');
      } 
      if (settings.classList.contains('hide')){
        settings.classList.remove('hide');
      }
      document.getElementById("title").innerHTML="Create Noticeboard"
      this.bacheca=new Bacheca();
      //mi metto in ascolto dell'evento che mi ritorna l'esito del salvataggio dei dati della bacheca
      this.bacheca.on("salvataggiobacheca", this.salvaAmministratore, this);
      //mi metto in ascolto dell'evento che mi ritorna l'esito del salvataggio dei dati del project manager
      this.bacheca.on("salvataggioAmministratore", this.salvaResponsabili, this);
      //mi metto in ascolto dell'evento che mi ritorna l'esito del salvataggio dei dati dei responsabili
      this.bacheca.on("salvataggioResponsabili", this.salvaMembri, this);
      //mi metto in ascolto dell'evento che mi ritorna l'esito del salavataggio dei dati degli users
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
    className: "i-g page size",

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
    // si occupa di caricare i membri aggiunti dalla pagina AddContacts nel caso
    // sono stati aggiunti membri (lo si fa controllando nel localStorage);
    caricaDati: function(){
      var titolo=localStorage.getItem("titolo");
      if (titolo!= null){
          document.getElementById("nomeBacheca").value=titolo;
      }
      var b = new Utente({
      nome:localStorage.getItem('nameLogged'),
      cognome:localStorage.getItem('surnameLogged')
    });
      this.subview1=(new ShowListMembers({model: b})).render().el;
      document.getElementById("membri").appendChild(this.subview1);
      
      var us = localStorage.getItem('utenti');
      var re= localStorage.getItem('responsabili');
      if (us!=null){
          var u =new Utenti();
          var users = JSON.parse(localStorage.getItem('utenti'));
          if(re!=null){ 
            var r = new Utenti();
            var admins = JSON.parse(localStorage.getItem('responsabili'));
            for (var i=0; i<users.length;i++){
                var tr= false;
                for (var j=0; j<admins.length; j++){
                  console.log(users[i].id);
                  console.log(admins[j].id);

                  if (users[i].id==admins[j].idu){
                    tr =true;
                  }
                }
                if (tr){
                  r.add(users[i]);
                }
                else{
                  u.add(users[i]);
                }
            }
            console.log(r);
            console.log(u);
            this.subview2=(new ShowListAdmins({collection: r})).render().el;  
            document.getElementById("membri").appendChild(this.subview2);
            this.subview3=(new ShowListUsers({collection: u})).render().el;  
            document.getElementById("membri").appendChild(this.subview3); 
          }
          else{
            u.add(users);
            console.log(u);
            this.subview2=(new ShowListUsers({collection: u})).render().el;  
            document.getElementById("membri").appendChild(this.subview2); 
          }
      }
      this.trigger("stop");
    },
    //chiama la query che si occupa del salvataggio dei dati della bacheca
    //se nella form non è stato inserito un titolo ne viene dato uno di default
    salva: function(){
      var title=document.getElementById("nomeBacheca").value;
      console.log(title);
      if (title==""){
        if (localStorage.getItem("numBacheca")!=null){
          var num=JSON.parse(localStorage.getItem("numBacheca"));
          console.log(num);
          num=num+1;
          console.log(num);
          title="Bacheca"+num;
          localStorage.setItem("numBacheca", num);
        }
        else{
          localStorage.setItem("numBacheca", 1);
          title="Bacheca1";
        }

      }
      console.log(title);
      this.bacheca.salvaBacheca(title);
    },
    //chiama la query che si occupa di salvare i dati dell'amministratore
    salvaAmministratore: function(res){
      console.log(res);
      this.idb=res.id;
      this.idu=localStorage.getItem("idu");
      this.bacheca.salvaAmministratore(this.idu, this.idb);
    },
    salvaResponsabili: function(res){

      //responsabili è la lista dei responsabili
      var a1 = new Array();
      var a2 = new Array()
      var o;
      var c1=0;
      var c2=0;
      var input= document.getElementsByClassName('licence');
      console.log("INPUT");
      console.log(input);
      for (var i=0; i<input.length;i++){
        if(input[i].checked){
            o=new Object({idu: input[i].value});
            console.log(o);
            if (input[i].classList.contains('admin')){
              a1[c1++]=o;
            }
            else if(input[i].classList.contains('simple-user')){
              a2[c2++]=o;
            }
        }
      }
      this.responsabili=a1;
      this.utenti=a2;
      console.log("salvaResponsabili"+this.responsabili);
      if(this.responsabili.length!=0){
          console.log("query");
          this.bacheca.salvaResponsabili(this.responsabili, this.idb);
      }
      else {
        console.log("vai a salvaMembri");
        this.salvaMembri();
      }
    },
    salvaMembri: function(res){
      console.log("entrato");
      //utenti è la lista degli utenti non responsabili
      if (this.utenti.length!=0){
        console.log("salvautenti");
        this.bacheca.salvaUtenti(this.utenti, this.idb);  
      }
      else{
        this.goToBacheca();
      }
    },
    //rimuovo dal localStorage i dati della bacheca che ho creato
    goToBacheca: function(res) {
      console.log("entra");
      localStorage.removeItem("utenti");
      localStorage.removeItem("responsabili");
      localStorage.removeItem("titolo");
      Backbone.history.navigate("bacheca/"+this.idb+"/manager", {
        trigger: true
      });
    },
    //salvo il contenuto dell'input di testo in cui c'è il titolo della bacheca
    //e vado alla pagina AddContacts
    goToAddContacts: function(e) {
      var a=new Array();
      var u= new Array();
      var input= document.getElementsByClassName('licence');
      var ca=0;
      var cu=0;
      var conta=0;
      for (var i=0; i<input.length;i++){
        conta++;
        if(input[i].checked){
            var o=new Object({idu: input[i].value});
            console.log(o);
            if (input[i].classList.contains('admin')){
              a[ca++]=o;
            }
            else{
              u[cu++]=o;
            }
        }
      }
      if (conta==0){
        localStorage.removeItem("responsabili");
        localStorage.removeItem("utenti");
      }
      else{
        console.log(a);
        console.log(u);
        if(a!=undefined && a.length!=0){
          localStorage.setItem("responsabili", JSON.stringify(a));
        }
        else{
          localStorage.removeItem("responsabili");
        }
        if(u!=undefined && u.length!=0){
          localStorage.setItem("utenti", JSON.stringify(u));
        }
        else{
          localStorage.removeItem("utenti");
        }
      }

      localStorage.setItem("titolo", document.getElementById("nomeBacheca").value);
      Backbone.history.navigate("addContacts/"+this.id+"/new", {
        trigger: true
      });
    }
  });

  return CreateBacheca;

});
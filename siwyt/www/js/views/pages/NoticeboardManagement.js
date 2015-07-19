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

    initialize: function(idb, idpage) {
      this.template = Utils.templates.structureBoardManagement;
      //copio l'id della bacheca che si sta gestendo
      this.idb=idb;

      document.getElementById("title").innerHTML="Board Management";
      var header= document.getElementById("header");
      var back=document.getElementById("back");
      var title=document.getElementById("title");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      }
      if (back.classList.contains('hide')){
        back.classList.remove('hide');
      }
      if (title.classList.contains('hide')){
        title.classList.remove('hide');
      }  

      
      // load the precompiled template
      
      this.bacheca=new Bacheca();

      //mi metto in ascolto dell'evento che mi ritorna l'esito della query di salvataggio del titolo
      this.bacheca.on("eventomodificaTitolo", this.salvaResponsabili, this); 
      //mi metto in ascolto dell'evento che mi ritorna i dati dell'amministatore
      this.bacheca.on("datiAmministratore", this.appendManager, this);
      //mi metto in ascolto dell'evento che mi ritorna i dati dei responsabili
      this.bacheca.on("datiResponsabili", this.appendAdmins, this);
      //mi metto in ascolto dell'evento che mi ritorna i dati degli utenti
      this.bacheca.on("datiMembri", this.appendUsers, this);
      //mi metto in ascolto dei dati della bacheca
      this.bacheca.on("datiBacheca", this.setTitle, this);
      //mi metto in ascolto dell'evento che mi ritorna l'esito del salvataggio dei dati dei responsabili
      this.bacheca.on("salvataggioResponsabili", this.salvaMembri, this);
      //mi metto in ascolto dell'evento che mi ritorna l'esito del salavataggio dei dati degli users
      this.bacheca.on("salvataggioUtenti", this.rimuoviResponsabili, this);
      //mi metto in ascolto dell'evento che mi ritorna l'esito della rimozione dei responsabili
      this.bacheca.on("rimuoviResponsabili", this.rimuoviMembri, this);
      //mi metto in ascolto dell'evento che mi ritorna l'esito della rimozione degli users
      this.bacheca.on("rimuoviMembri", this.goToBacheca, this);
     
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
    caricaMembriDaHome: function(e){
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
        this.bacheca.listaIdResponsabiliDiUnaBacheca(this.idb);   
    },
    
  caricaMembriDaContacts: function(){
      var titolo=localStorage.getItem("titolo");
      if (titolo!= null){
          document.getElementById("titleBacheca").value=titolo;
      }
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
            this.subview2=(new ShowListUsers({collection: u})).render().el;  
            document.getElementById("membri").appendChild(this.subview2); 
          }
      }
    },

        

       
    
    //la funzione carica il titolo salvato nel localStorage nel campo di input
    //altrimenti fa la query per ottenerlo
    caricaDati: function(){
        var titolo=localStorage.getItem("titolo");
        if (titolo!=null){
           document.getElementById("titleBacheca").value=titolo;
        }
        else{
           this.bacheca.noticeboardData(this.idb);
        }
    },
    setTitle: function(res){
        document.getElementById("titleBacheca").value=res[0].nome;
    },
    appendAdmins: function(result){
    console.log(result);
      localStorage.setItem("oldAdmins", JSON.stringify(result));
      var b= new Utenti();
      b.add(result);
      this.subView = (new ShowListAdmins({collection: b})).render().el;
      console.log(this.subView);
      document.getElementById("membri").appendChild(this.subView);
      this.bacheca.listaIdMembriDiUnaBacheca(this.idb);
    },
    appendUsers: function(result){
    console.log(result);
      localStorage.setItem("oldUsers", JSON.stringify(result));
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

      console.log(a);
      if(a[0]!=undefined && a.length!=0){
        localStorage.setItem("responsabili", JSON.stringify(a));
      }
      else{
        localStorage.removeItem("responsabili");
      }

      localStorage.setItem("titolo", document.getElementById("titleBacheca").value);

      console.log("entrato");
        Backbone.history.navigate("addContacts/"+this.id+"/"+this.idb, {
        trigger: true
      });
    },
    update: function(e){
        this.bacheca.modificaTitolo(this.idb, document.getElementById("titleBacheca").value);        
    },
    
    salvaResponsabili: function(res){

      //responsabili è la lista dei responsabili
      var a1 = new Array();
      var a2 = new Array();
      var o;
      var c1=0;
      var c2=0;
      var input= document.getElementsByClassName('licence');
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
      this.oldAdmins=JSON.parse(localStorage.getItem("oldAdmins"));
      this.oldUsers=JSON.parse(localStorage.getItem("oldUsers"));

      var adminsAggiungere=new Array();
      var caa=0;
      var adminsEliminare=new Array();
      var cae=0;
      var usersAggiungere=new Array();
      var cua=0;
      var usersEliminare=new Array();
      var cue=0;
      var tr=false;
      var o;
      //controllo se i vecchi responsabili ci sono ancora
      for (var i=0; i<this.oldAdmins.length;i++){
          tr=false;
          o=new Object({idu: this.oldAdmins[i].id});
          for(var j=0;j<this.responsabili.length;j++){
              if(this.oldAdmins[i].id==this.responsabili[j].idu){
                tr=true;
              }
          }
          if(!tr){
            for(var k=0; k<this.utenti.length;k++){
              if(this.oldAdmins[i].id==this.utenti[k].idu){
                  tr=true;
              }
            }
            if(tr){
              adminsEliminare[cae++]=o;
              usersAggiungere[cua++]=o;
            }
            else{
              adminsEliminare[cae++]=o;
            }
          }
      }

      //controllo se i vecchi utenti ci sono ancora
      for (var i=0; i<this.oldUsers.length;i++){
          tr=false;
          o=new Object({idu: this.oldUsers[i].id});
          for(var j=0;j<this.utenti.length;j++){
              if(this.oldUsers[i].id==this.utenti[j].idu){
                tr=true;
              }
          }
          if(!tr){
            for(var k=0; k<this.responsabili.length;k++){
              if(this.oldUsers[i].id==this.responsabili[k].idu){
                  tr=true;
              }
            }
            if(tr){
              usersEliminare[cue++]=o;
              adminsAggiungere[cua++]=o;
            }
            else{
              usersEliminare[cue++]=o;
            }
          }
      }
      
      
      //controllo se i nuovi responsabili c'erano
      for (var i=0; i<this.responsabili.length;i++){
          tr=false;
          o=new Object({idu: this.responsabili[i].idu});
          for(var j=0;j<this.oldAdmins.length;j++){
              if(this.responsabili[i].idu==this.oldAdmins[j].id){
                tr=true;
              }
          }
          if(!tr){
            for(var k=0; k<this.oldUsers.length; k++){
              if(this.responsabili[i].idu==this.oldUsers[k].id){
                  tr=true;
              }
            }
            if(tr){
              adminsAggiungere[caa++]=o;
              usersEliminare[cue++]=o;
            }
            else{
              adminsAggiungere[caa++]=o;
            }
          }
      }
      //controllo se i nuovi utenti c'erano
      for (var i=0; i<this.utenti.length;i++){
          tr=false;
          o=new Object({idu: this.utenti[i].idu});
          for(var j=0;j<this.oldUsers.length;j++){
              if(this.utenti[i].idu==this.oldUsers[j].id){
                tr=true;
              }
          }
          if(!tr){
            for(var k=0; k<this.oldAdmins.length; k++){
              if(this.utenti[i].idu==this.oldAdmins[k].id){
                  tr=true;
              }
            }
            if(tr){
              usersAggiungere[cua++]=o;
              adminsEliminare[cae++]=o;
            }
            else{
              usersAggiungere[cua++]=o;
            }
          }
      }

      this.usersAggiungere=usersAggiungere;
      this.usersEliminare=usersEliminare;
      this.adminsAggiungere=adminsAggiungere;
      this.adminsEliminare=adminsEliminare;


      if(this.adminsAggiungere.length!=0){
          console.log("query");
          this.bacheca.salvaResponsabili(this.adminsAggiungere, this.idb);
      }
      else {
        console.log("vai a salvaMembri");
        this.salvaMembri();
      }
    },

    salvaMembri: function(res){
      //utenti è la lista degli utenti non responsabili
      if (this.usersAggiungere.length!=0){
        this.bacheca.salvaUtenti(this.usersAggiungere, this.idb);  
      }
      else{
        this.rimuoviResponsabili();
      }
    },
    rimuoviResponsabili: function(res){
      //utenti è la lista degli utenti non responsabili
      if (this.adminsEliminare.length!=0){
        this.bacheca.idRigheResponsabili(this.adminsEliminare, this.idb);  
      }
      else{
        this.rimuoviMembri();
      }
    }
    ,
    rimuoviMembri: function(res){
      //utenti è la lista degli utenti non responsabili
      if (this.usersEliminare.length!=0){
        this.bacheca.idRigheMembri(this.usersEliminare, this.idb);  
      }
      else{
        this.goToBacheca();
      }
    },
    goToBacheca: function(res){
        localStorage.removeItem("responsabili");
        localStorage.removeItem("utenti");      
        Backbone.history.navigate("bacheca/"+this.idb, {
            trigger: true
        });
    },
    render: function() {
      $(this.el).html(this.template);
      return this;
    }

  });

  return NoticeboardManagement;

});
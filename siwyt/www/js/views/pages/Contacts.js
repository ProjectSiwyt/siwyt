define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utils = require("utils");
  var Utenti = require("collections/Utenti");
  var Bacheche = require("collections/Bacheche");
  var Bacheca = require("models/Bacheca");
  var Contatto = require("models/Contatto");
  var ShowListContacts = require("views/pages/ShowListContacts");
  var ShowListContactsSearch = require("views/pages/ShowListContactsSearch");
  var ShowListNoticeboardContacts = require("views/pages/ShowListNoticeboardContacts");
  var $ = require("jquery");


  var Contacts = Utils.Page.extend({

    constructorName: "Contacts",
    model: Utente,
    model: Contatto,
   

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structureContacts;
      console.log("initialize template contacts");
      /*document.getElementById("navigation").style.display="inlne-block";
      document.getElementById("header").style.display="inherit";*/
      var navigation= document.getElementById("navigation");
      var header= document.getElementById("header");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      }
      if (navigation.classList.contains('hide')){
        navigation.classList.remove('hide');
      };
      document.getElementById("back").classList.add('hide');
      document.getElementById("title").innerHTML="Contacts";
      this.contatto = new Contatto();
      this.utente = new Utente();
      this.bacheca = new Bacheca();
      this.bacheca.on("bachecheamministratore", this.elencoBacheche ,this);
      this.utente.on("elencoUtenti", this.search, this);
      this.utente.on("resultCercaUtente", this.showResultSearch, this);      
      this.contatto.on("contattoCancellato", this.aggiornaLista, this);
      this.utente.on("listContacts", this.showContacts, this);

      

      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "contacts",
    className: "i-g page size",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "swipeLeft": "goToHome",
      "tap .removeContact": "removeContact",
      "tap .addToBoard": "showBoard",
      "tap .overlay": "chiudiPopup",
      "tap .overlaySearch": "chiudiPopupSearch",
      "keyup":"startSearch",
      "tap #search": "startSearch",
      "tap .fa-times-circle-o":"resetSearch",
      "tap #invite": "invite"
      //"tap .rigabacheca": "aggiungiUtente"
      /*"tap .add_to_board": "add_to_board",
      "tap .remove_contact": "remove_contact"*/
    },

    showContacts: function(result){
      document.getElementById("contactsContent").innerHTML="";
      console.log( result);
      var c = new Utenti();
      c.add(result);
      /*console.log(c);
      console.log("contattiiiii: "+c);*/
      this.subViewContacts = (new ShowListContacts({collection: c})).render().el;
      /*console.log("subview " +this.subView);*/
       console.log(this.subViewContacts); 
      document.getElementById("contactsContent").appendChild(this.subViewContacts);
      //document.getElementById("search").addEventListener("keyup", this.startSearch(document.getElementById("search").value));

    },

    aggiornaLista: function(result){
      console.log("result aggiorna lista: ",result);
      $("#"+result).remove();
    },

    render: function() {
      $(this.el).html(this.template());

      return this;
    },

    resetSearch: function(e){
        document.getElementById("search").value="";
        var searchPopup = document.getElementById("searchPopup");
        var searchScreen = document.getElementById("searchScreen");
        searchScreen.classList.add('hide');
        searchPopup.classList.add('hide');
    },

    removeContact: function(e){
     /* var name = e.currentTarget.parentNode.id*/
      console.log(e.currentTarget.parentNode.id);
      var r = confirm("Are you sure you want to remove this contact");
      if (r){
        this.contatto.rimuoviContatto(e.currentTarget.parentNode.id, localStorage.getItem("idu"));
        //this.utente.listContacts(localStorage.getItem("idu"));
        //this.render();
      }
      
      
    },

    invite: function(e){
      var mail = document.getElementById("mail").value;
        this.utente.inviaMailInvito(localStorage.getItem("nameLogged"),localStorage.getItem("surnameLogged"),mail)
    },

    startQuery: function(e){
      this.bacheca.listaIdBachecheAmministratore();
      this.utente.listContacts(localStorage.getItem("idu"));
      //this.startListenerSearch();
    },

    chiudiPopup: function(e){
        idu = sessionStorage.getItem("idUserToAdd");
        var popScreen = document.getElementById("LinkScreen");
        var popPopup = document.getElementById(""+idu+"LinkPopup");
        popScreen.classList.toggle('hide');
        popPopup.classList.toggle('hide');
    },

    chiudiPopupSearch: function(e){
        idu = sessionStorage.getItem("idUserToAdd");
        var popScreen = document.getElementById("searchScreen");
        var popPopup = document.getElementById("searchPopup");
        popScreen.classList.toggle('hide');
        popPopup.classList.toggle('hide');
        this.utente.listContacts(localStorage.getItem("idu"));
    },
   /* elencoUtenti: function(e){
      this.utente.elencoUtenti();
    },*/

    //Creo una subview con l'elnco di bacheche d
    elencoBacheche: function(result){
      console.log(result);
      var c = new Bacheche();

      c.add(result);
      console.log(c);
      this.subViewBoards = (new ShowListNoticeboardContacts({collection: c})).render().el;
    },

    aggiungiUtente: function(e){
      var idu = sessionStorage.getItem("idUserToAdd");
      var idb = e.currentTarget.id;
      this.bacheca.salvaUtenti(idu, idb);
    },

    showBoard: function(e){
      //$("#subviewContacts").remove();
      console.log(this.subViewBoards);
      document.getElementById(e.currentTarget.parentNode.id+"LinkPopup").appendChild(this.subViewBoards);
      var popScreen = document.getElementById("LinkScreen");
      var popPopup = document.getElementById(""+e.currentTarget.parentNode.id+"LinkPopup");
      popScreen.classList.toggle('hide');
      popPopup.classList.toggle('hide');
      sessionStorage.setItem("idUserToAdd", e.currentTarget.parentNode.id );
    },

    showResultSearch: function(result){
        /*if(!result){
          var searchPopup = document.getElementById("searchPopup");
          var searchScreen = document.getElementById("searchScreen");
          searchScreen.classList.remove('hide');
            //searchPopup.innerHTML="Nessun risultato";
            searchPopup.classList.remove('hide');

        }else{*/
          var c = new Utenti();
          c.add(result);
          console.log(c);
          this.subViewContactsSearch = (new ShowListContactsSearch({collection: c})).render().el;
          /*console.log("subview " +this.subView);*/
          console.log(this.subViewContactsSearch);
          var searchScreen = document.getElementById("searchScreen");
          var searchPopup = document.getElementById("searchPopup");
          searchPopup.innerHTML="";
          searchPopup.appendChild(this.subViewContactsSearch);
          searchScreen.classList.remove('hide');
          searchPopup.classList.remove('hide');
        

    },


    goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
    },

/*    startListenerSearch: function(e){
      console.log(document.getElementById("search"));
      document.getElementById("search").addEventListener("keyup", this.startSearch(document.getElementById("search").value));
      
    },*/

    startSearch:function(){
      $("#searchContacts").remove();
      var searchScreen = document.getElementById("searchScreen");
      var searchPopup = document.getElementById("searchPopup");      
      searchScreen.classList.add('hide');
      searchPopup.classList.add('hide');
      
      str = document.getElementById("search").value;
      if( str.length > 2)
        this.utente.cercaUtente(str);
     
      console.log(str);

    } 


  });

  return Contacts;

});
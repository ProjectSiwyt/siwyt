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
  var ShowListNoticeboardContactsFull = require("views/pages/ShowListNoticeboardContactsFull");
  var Spinner= require("spin");
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
      this.signal =false;
      var THIS = this;
      this.on('stop', function(){THIS.spinner.stop(); THIS.signal=true;});

       var opts = {
          lines: 13 // The number of lines to draw
          , length: 11 // The length of each line
          , width: 7 // The line thickness
          , radius: 26 // The radius of the inner circle
          , scale: 1 // Scales overall size of the spinner
          , corners: 1 // Corner roundness (0..1)
          , color: '#000' // #rgb or #rrggbb or array of colors
          , opacity: 0.25 // Opacity of the lines
          , rotate: 0 // The rotation offset
          , direction: 1 // 1: clockwise, -1: counterclockwise
          , speed: 2 // Rounds per second
          , trail: 60 // Afterglow percentage
          , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
          , zIndex: 2e9 // The z-index (defaults to 2000000000)
          , className: 'spinner' // The CSS class to assign to the spinner
          , top: '50%' // Top position relative to parent
          , left: '50%' // Left position relative to parent
          , shadow: false // Whether to render a shadow
          , hwaccel: false // Whether to use hardware acceleration
          , position: 'absolute' // Element positioning
      }
      
      this.spinner = new Spinner(opts);

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
      "tap .addToBoard": "showBoards",
      "tap .overlay": "chiudiPopup",
      "tap .overlaySearch": "chiudiPopupSearch",
      "keyup":"startSearch",
      "tap #search": "startSearch",
      "tap .fa-times-circle-o":"resetSearch",
      "tap #new":"createBoard",
      "tap #invite": "invite"
      //"tap .rigabacheca": "aggiungiUtente"
      /*"tap .add_to_board": "add_to_board",
      "tap .remove_contact": "remove_contact"*/
    },

    showContacts: function(result){
      this.signal = true;
      this.trigger("stop");
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

    createBoard: function(e){
      localStorage.removeItem('utenti');
      localStorage.removeItem('responsabili');
      localStorage.removeItem('titolo');
      Backbone.history.navigate("createBacheca", {
        trigger: true
      });
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
      var emailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;
      var email = document.getElementById("mail").value;
      console.log("email ",email);
      var valid = true;
      var textmessage = "Invalid Email";;
      if (!emailExp.test(email) || (email == "") || (email == "undefined")) {
                   valid = false;
                }
      
      if(valid){
          //this.utente.inviaMailInvito(localStorage.getItem("nameLogged"),localStorage.getItem("surnameLogged"),mail);
          textmessage = "Mail sent to "+email;
        }

        //DA INSERIRE IN UN METODO RICHIAATO SUL SUCCESS DELL INVIO MAIL
           window.plugins.toast.showWithOptions(
              {
                message: textmessage,
                position: "bottom",
                duration: "short",
                addPixelsY: -100
              }
          );
     
    },

    startQuery: function(e){
      //this.bacheca.listaIdBachecheAmministratore();
      this.utente.listContacts(localStorage.getItem("idu"));
      //this.startListenerSearch();
    },

    chiudiPopup: function(e){
        idu = sessionStorage.getItem("idUserToAdd");
        var popScreen = document.getElementById("LinkScreen");
        var popPopup = document.getElementById(""+idu+"LinkPopup");
        popScreen.classList.toggle('hide');
        popPopup.classList.toggle('hide');
        $("#listBoardsContacts").remove();
        $("#listBoardsContactsFull").remove();
    },

    chiudiPopupSearch: function(e){
        idu = sessionStorage.getItem("idUserToAdd");
        var popScreen = document.getElementById("searchScreen");
        var popPopup = document.getElementById("searchPopup");
        var searchInput = document.getElementById("search");
        var searchDelete = searchInput.parentNode.children[1];
        popScreen.classList.toggle('hide');
        popPopup.classList.toggle('hide');
        if (searchInput.classList.contains('search-result')&&searchDelete.classList.contains('search-result')){
          searchInput.classList.remove('search-result');
          searchDelete.classList.remove('search-result');
        }
        this.utente.listContacts(localStorage.getItem("idu"));
    },
   /* elencoUtenti: function(e){
      this.utente.elencoUtenti();
    },*/

    //Creo una subview con l'elenco di bacheche d
    elencoBacheche: function(result){
      var usr = sessionStorage.getItem("idUserToAdd");
      var idLinkPopup = document.getElementById(usr+"LinkPopup");
      var popScreen = document.getElementById("LinkScreen");
        var popPopup = document.getElementById(usr+"LinkPopup");        
      console.log("elenco bacheche",result);
      if(result!=0){
        console.log(result);
        var c = new Bacheche();

        c.add(result);
        console.log(c);
        this.subViewBoards = (new ShowListNoticeboardContacts({collection: c})).render().el;
        console.log(this.subViewBoards);
        idLinkPopup.appendChild(this.subViewBoards);
        
        popScreen.classList.toggle('hide');
        popPopup.classList.toggle('hide');
        if(result!=null)
        document.getElementById("nameContact").innerHTML=sessionStorage.getItem("nameContact");
        }
      else{

          this.subViewBoards = (new ShowListNoticeboardContactsFull()).render().el;          
          idLinkPopup.appendChild(this.subViewBoards);
          idLinkPopup.classList.remove('h1-fix-scroll');
          popScreen.classList.toggle('hide');
          popPopup.classList.toggle('hide');
          document.getElementById("nameContact").innerHTML=sessionStorage.getItem("nameContact");
      }

    },

    aggiungiUtente: function(e){
      var idu = sessionStorage.getItem("idUserToAdd");
      var idb = e.currentTarget.id;
      this.bacheca.salvaUtenti(idu, idb);
    },

    showBoards: function(e){
      //$("#subviewContacts").remove();
      sessionStorage.setItem("idUserToAdd", e.currentTarget.parentNode.id );
      var n = $("#"+e.currentTarget.parentNode.id)[0].innerText;
      sessionStorage.setItem("nameContact", n);
      this.bacheca.listaBachecheAmministratoreContact(localStorage.getItem("idu"), sessionStorage.getItem("idUserToAdd"));
    },

    showResultSearch: function(result){

          this.trigger("stop");
          var c = new Utenti();
          c.add(result);
          console.log(c);
          this.subViewContactsSearch = (new ShowListContactsSearch({collection: c})).render().el;
          /*console.log("subview " +this.subView);*/
          console.log(this.subViewContactsSearch);
          var searchScreen = document.getElementById("searchScreen");
          var searchPopup = document.getElementById("searchPopup");
          var searchInput = document.getElementById("search");
          var searchDelete = searchInput.parentNode.children[1];
          searchPopup.innerHTML="";
          searchPopup.appendChild(this.subViewContactsSearch);
          searchScreen.classList.remove('hide');
          searchPopup.classList.remove('hide');
          searchInput.classList.add('search-result');
          searchDelete.classList.add('search-result');
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
      var THIS = this;
      str = document.getElementById("search").value;
      if( str.length > 2){
        setTimeout(function(){if(!THIS.signal) THIS.spinner.spin(document.body);},0);
        this.utente.cercaUtente(str);
        }
      console.log(str);

    } 


  });

  return Contacts;

});
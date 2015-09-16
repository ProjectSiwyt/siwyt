define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Bacheche = require("collections/Bacheche");
  var Utils = require("utils");
  var Utente = require("models/Utente");

  var ShowListNoticeboardsContacts = Utils.Page.extend({

    constructorName: "ShowListNoticeboardsContacts",

    model: Bacheca,

    initialize: function() {
      // load the precompiled template
      this.bacheca = new Bacheca();
      this.template = Utils.templates.contentListBoardsContacts;
      this.utente = new Utente();
      this.bacheca.on("utenteAggiunto", this.showChecked, this);
      this.bacheca.on("salvataggioUtente", this.chiudiPopup, this);
      console.log("name ",sessionStorage.getItem("nameContact"));
      this.boards = [];
      this.len = 0;
      this.idb =0;
      /*console.log(document.getElementById("nameContact"));
      document.getElementById("nameContact").innerHTML=sessionStorage.getItem("nameContact");*/

      
     // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "listBoardsContacts",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap .rigabacheca": "addContactToBacheca",
      "tap #done": "save"
    },

    render: function() {
      $(this.el).html(this.template(this.collection.toJSON()));
      return this;
    },

    showChecked: function(e){
        var item = document.getElementsByClassName("current")[0];
        item.classList.toggle('aggiunto');
        console.log(item);
        var i = item.childNodes[3];
        i.classList.toggle('fa-square-o');
        i.classList.toggle('fa-check-square-o');
        $(".current").removeClass("current");
        //this.utente.inviaMailContattoAggiunto(localStorage.getItem("nameLogged"), localStorage.getItem("surnameLogged"), result);

    },

    addContactToBacheca: function(e){
      var idb = e.currentTarget.getAttribute("data-id");
      e.currentTarget.classList.toggle("current");
      console.log(idb);
      var idu = sessionStorage.getItem("idUserToAdd");
      console.log("a :", e.currentTarget);
      if(!($(e.currentTarget).hasClass("aggiunto"))){
        this.boards[this.len]= idb;
        console.log(this.boards);
        this.len++;
        }
      else{
        for(var i =0; i<this.boards.length;i++){
          if(this.boards[i]==idb)
            this.boards[i]=0;
        }
      }
      this.showChecked();
      //});
    
    },

    chiudiPopup: function(e){
        idu = sessionStorage.getItem("idUserToAdd");
        var popScreen = document.getElementById("LinkScreen");
        var popPopup = document.getElementById(""+idu+"LinkPopup");
        popScreen.classList.toggle('hide');
        popPopup.classList.toggle('hide');
        $("#listBoardsContacts").remove();
    },


    save: function(e){
      if(this.boards.length>0){
          var r = [];
          var c =0;
          for (var i =0;i< this.boards.length;i++){
            if(this.boards[i]!=0){
              r[c]=this.boards[i];
              c++;
            }
          }
          console.log("utente da aggiungere ",sessionStorage.getItem("idUserToAdd"));
          console.log("alle bacheche: ", r);
          this.bacheca.aggiungiUtenteBacheche(sessionStorage.getItem("idUserToAdd"), r);
        }
      else this.chiudiPopup();
    },

  });

  return ShowListNoticeboardsContacts;

});
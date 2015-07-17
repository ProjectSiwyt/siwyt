define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Utenti = require("collections/Utenti");
  var Utils = require("utils");
  var ShowPostitsNoticeboard= require("views/pages/ShowPostitsNoticeboard");
  var ShowListAddContacts= require("views/pages/ShowListAddContacts");

  var AddContacts = Utils.Page.extend({

    constructorName: "AddContacts",

    model: Utente,

    initialize: function(idpage,idb) {
      this.returnpage=idpage;
      this.idb=idb;
       document.getElementById("back").removeAttribute("style");
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structureAddContacts;
      this.utente = new Utente();
      this.utente.on("listContacts",this.appendContacts, this);
      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "addcontacts",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #submitAddContacts": "goToPage"
    },
    loadData: function(){
        this.utente.listContacts(localStorage.getItem("idu"));
    },
    appendContacts: function(result){
      console.log(result);
      var b = new Utenti();
      var users= localStorage.getItem("utenti");
      
      if (users!= null){
          var array=new Array();
          var c=0;
          var a=JSON.parse(users);
        
          var tr=false;
          for (var i=0; i<result.length;i++){
            tr=false
            for (var j=0; j<a.length;j++){
                if (result[i]==a[j]){
                  tr=true;
                }
            }
            if (!tr){
              b.add(a[j]);
              array[c++]=a[j];
            }
          }
          this.addMembers=array;
      }
      else{
        b.add(result);
        this.addMembers=result;
      } 
      console.log(b);
      this.subView = (new ShowListAddContacts({collection: b})).render().el;
      console.log(this.subView);
        //quando i dati vengono caricati faccio la render della pagina contenente la lista delle bacheche
      //$('#boardContent').append(this.subView);
      document.getElementById("contactsContent").appendChild(this.subView);
    },

    render: function() {
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));

      return this;
    },
    //torna alla pagina da cui si proviene
    goToPage: function(e) {
      var c=new Utenti();
      console.log(this.addMembers);
      if (this.addMembers[0]!=undefined){
        for (var i=0; i<this.addMembers.length;i++){
          if (document.getElementById(""+this.addMembers[i].id).classList.contains("fa-user-times")){
              c.add(this.addMembers[i]);
          }
        }
      }
      console.log(c);
      if(c.length!=0){
        localStorage.setItem("utenti", JSON.stringify(c));
      }
      if (this.returnpage=="noticeboardManagement"){
          Backbone.history.navigate("boardManagement/"+this.idb, {
          trigger: true
        });
      }
      else{
        Backbone.history.navigate("createBacheca", {
          trigger: true
        });
      }
    }
  });

  return AddContacts;

});
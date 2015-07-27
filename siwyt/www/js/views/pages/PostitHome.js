define(function(require) {

  var Backbone = require("backbone");
  var MyModel = require("models/MyModel");
  var Commenti = require("collections/Commenti");
  var Commento = require("models/Commento");
  var Utils = require("utils");
  var Postit= require("models/Postit");
  var Postits=require("collections/Postits");
  var ShowListComments = require("views/pages/ShowListComments");
  var ShowPostit= require("views/pages/ShowPostit");

  var PostitHome = Utils.Page.extend({

    constructorName: "PostitHome",

    model: Commento,

    initialize: function(idp, idb) {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.structurePostit;
      this.idp=idp;
      this.idb=idb;
      
      document.getElementById("navigation").classList.add('hide');
      document.getElementById("title").classList.add('hide');
      var header= document.getElementById("header");
      var settings = document.getElementById("settingsMenu");
      var back=document.getElementById("back");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      }
      if (settings.classList.contains('hide')){
        settings.classList.remove('hide');
      }
      if(back.classList.contains('hide')){
        back.classList.remove('hide');
      }
     
      spinner.spin();
      this.commento=new Commento();
      this.commento.on("elencoCommenti", this.appendComments, this);
      this.commento.on("aggiuntoCommento", this.appendComment, this);
      this.commento.on("eventoNomiAutori", this.appendComments2, this);
      this.postit=new Postit();      
      this.postit.on("datiPostit", this.loadPostit, this);
      this.postit.on("datiAutore", this.loadPostit2, this)

    },

    id: "postitHome",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #submitComment":"submit"
      //"tap": "goToContacts",
      
    },
    caricaDati: function(){
        this.postit.postitData(this.idp);

    },
    loadPostit: function(result){
        this.resultpostit=result;
        this.postit.nomeAutore(result[0].idu);
        console.log(result[0].idu)
     },
     loadPostit2: function(result){
        console.log(result);
        this.resultpostit[0].idu=result;
        var post=new Postits();
        post.add(this.resultpostit);
        this.subView = (new ShowPostit({collection: post})).render().el;
        console.log(this.subView);
        document.getElementById("postitContent").appendChild(this.subView);
        this.commento.elencoCommentiPostit(this.idp);
    },
    appendComments: function(result){
        console.log(result);
        this.comments=result;
        this.commento.nomeAutori(result);
    },
    appendComments2: function(res){
        var commenti = new Commenti();
        for (var i = 0; i < this.comments.length; i++) {
            for(var j=0; j<res.length;j++){
                if (this.comments[i].idu==res[j].id){
                    this.comments[i].idu=res[j].username;
                    break;
                }
            }
        }

        commenti.add(this.comments);
        this.subView = (new ShowListComments({
            collection: commenti
        })).render().el;
        document.getElementById("postitContent").appendChild(this.subView);
    },
    submit: function(e){
      this.commento.aggiungiCommento(this.idp, document.getElementById("textComment").value, localStorage.getItem("idu"));
      document.getElementById("textComment").value="";
    },
    appendComment: function(res){
      var a =new Array();
      a[0]=res;
      this.comments=a;
      this.commento.nomeAutori(a);
    },
    render: function() {
      spinner.stop();
      $(this.el).html(this.template());
      //$(this.el).html(this.template(this.model.models));

      return this;
    },
    goToBacheca: function(e) {
      Backbone.history.navigate("bacheca/"+this.idb, {
        trigger: true
      });
    }
    
  });

  return PostitHome;

});
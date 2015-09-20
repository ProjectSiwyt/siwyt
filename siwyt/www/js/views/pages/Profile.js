define(function(require) {

  var Backbone = require("backbone");
  var Utente = require("models/Utente");
  var Bacheca = require("models/Bacheca");
  var Utils = require("utils");


  var Profile = Utils.Page.extend({

    constructorName: "Profile",

    model: Utente,

    initialize: function() {
      // load the precompiled templates (NOTA: bisogna aggiungere il template in templates.js)
      this.template = Utils.templates.profile;
      console.log("initialize template profile");
      var navigation= document.getElementById("navigation");
      var header= document.getElementById("header");
      var settings = document.getElementById("settingsMenu");
      if (header.classList.contains('hide')){
        header.classList.remove('hide');
      }
      if (navigation.classList.contains('hide')){
        navigation.classList.remove('hide');
      };
      if (settings.classList.contains('hide')){
        settings.classList.remove('hide');
      };
      document.getElementById("back").classList.add('hide');
      document.getElementById("title").innerHTML="Profile";
      

      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
      var idUtente = localStorage.getItem('idu');
      this.utente = new Utente();
      this.bacheca = new Bacheca();
      

      this.utente.on("eventoContaBachecheUtente", this.showNumBachecheUtente, this);
      this.bacheca.on("numBachecheAmministratore", this.showNumBachecheAmministratore, this);
      this.bacheca.on("numBachecheResponsabile", this.showNumBachecheResposnsabile, this);
      this.utente.on("accountDeleted", this.goOut, this);
      this.utente.on("datiUtente", this.showDatiUtente , this);
      this.utente.on("changePasswordDone", this.changePasswordDone, this);
      this.utente.on("baasboxLogout", this.logOut , this);
      
      
      //this.utente.on("resultData", this.showData, this);
      // carico i dati dell utente 
      //this.utente.requestData(idUtente);

      //this.utente.on("resultSaveDate",this.saveData, this);
      //this.utente.on("resultDeleteAccount", this.goOut, this);
      //this.utente.on("resultCheckPassword", this);
      //console.log(this.utente);
    },

    id: "profile",
    className: "i-g page scroll size scroll-profile",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "swipeRight": "goToHome",
      "tap #deleteAccount": "deleteAccount",
      "tap #editData":"editData",
      "tap #editPassword": "editPassword",
      "tap #saveData": "validateEditedData",
      "tap #deleteData": "cancellChanges",
      "tap #savePassword": "validateChangePassword",
      "tap #cancellChangePass": "cancellChangePass",
      "tap #changeImg": "changeImg"
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      //$(this.el).html(this.template(this.model.models));

      return this;
    },

    logOut: function(result){
      console.log("result "+result);
      if(result){
        localStorage.clear();
        Backbone.history.navigate("login", {
        trigger: true
      });
      }
    },


    startQuery: function(e){
      if (this.numUser==undefined)
          this.utente.contaBacheche();
      else{
        document.getElementById("numBachecheUser").innerHTML=this.numUser;
        document.getElementById("numBachecheAdmin").innerHTML=this.numAdmin;
        document.getElementById("numBachecheManager").innerHTML=this.numMan;
        document.getElementById("numTotBacheche").innerHTML=this.numUser + this.numAdmin + this.numMan;;
      }
      if(localStorage.getItem("signUpDate")==undefined)
        this.utente.caricaDati();
      else{
          document.getElementById("iscrizione").innerHTML=localStorage.getItem("signUpDate").slice(0,10);
          this.showImage();
      }

    },


    showNumBachecheUtente: function(result){
      console.log("num bacheche ytente"+result);
        document.getElementById("numBachecheUser").innerHTML=result;
      this.bacheca.contaBachecheResponsabile();
      //localStorage.setItem("numBachecheUser", result);
      this.numUser = result;

    },

     showNumBachecheResposnsabile: function(result){
      console.log("num bacheche responsabile"+result);
        document.getElementById("numBachecheAdmin").innerHTML=result;
      this.bacheca.contaBachecheAmministratore();
      //localStorage.setItem("numBachecheAdmin", result);
      this.numAdmin = result;
    },

    showNumBachecheAmministratore: function(result){
      console.log("num bacheche manager"+result);
      this.numMan = result;
      //localStorage.setItem("numBachecheManager", result);
      document.getElementById("numBachecheManager").innerHTML=result;
      var tot = this.numUser + this.numAdmin + this.numMan;
      document.getElementById("numTotBacheche").innerHTML=tot;
      this.trigger("stop");

    },

    showDatiUtente: function(result){
      console.log("result showDatiUtente ", result);
      localStorage.setItem("signUpDate", result.signUpDate.slice(0,10))
      document.getElementById("iscrizione").innerHTML=localStorage.getItem("signUpDate");
      this.showImage();
    },

    showImage: function(e){
      if(localStorage.getItem("imageLogged")!=""){
          var image = document.getElementById("imgP");
          console.log(image);
          image.src = 'data:image/png;base64,'+localStorage.getItem("imageLogged");
      }
    },



    deleteAccount: function(e){
      var del = window.confirm("Are you sure you want to delete your account?");
      console.log(del);
      if(del) 
          //this.utente.deleteAccount(localStorage.getItem("idu"));
          this.utente.deleteUserDataUser(localStorage.getItem("idu"));
    
    },

    changeImg: function(e){
     

      var THIS= this;
      console.log(THIS , "changeImg");
        navigator.notification.confirm(
        'Select source',  // message
        THIS.getImg,                  // callback to invoke
        'Change Image',            // title
        'Camera,Photo Gallery'             // buttonLabels
        );
    },

    getImg: function(e){
        var THIS = this;
        console.log(THIS);
        // caricamento dell immagine dalla collezione di immagini
        if(e==2){
          //var THIS = this;
          console.log("PHOTOLIBRARY"); 
         navigator.camera.getPicture(saveImgAlbum, onFail, 
          { quality: 80, 
           targetWidth: 150,
           targetHeight: 150,
           destinationType: Camera.DestinationType.DATA_URL,
           sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM });
            var THISS = THIS;
            function saveImgAlbum(img){
              console.log(THISS);
                  var utenteIm = new Utente();
                  console.log("save img GALLERY", img);
                  //console.log(DATA_URL);
                  var usr = localStorage.getItem("usernameLogged");
                  utenteIm.saveImage(usr,img);
                  utenteIm.on("resultSaveImage", function(){
                                                    var image = document.getElementById("imgP");
                                                    console.log(image);
                                                    image.src = 'data:image/png;base64,'+localStorage.getItem("imageLogged");}, this);
                  
            }

            function onFail(e){
              console.log("save image gallery failed");
            }
          }

        // caricamento dell immagine direttamente dalla camera
        else{
          if (e==1){
            //var THIS = this;
            console.log("Camera"); 
            navigator.camera.getPicture(saveImgCamera, onFail, 
              { quality: 80, 
               targetWidth: 150,
               targetHeight: 150,
               //allowEdit: true,
               encodingType: Camera.EncodingType.JPEG,
               destinationType: Camera.DestinationType.DATA_URL,
               sourceType: Camera.PictureSourceType.CAMERA});

              function saveImgCamera(img){
                  var utenteIm = new Utente();
                  console.log("save img camera", img);
                  var usr = localStorage.getItem("usernameLogged");
                  utenteIm.saveImage(usr,img);
                  utenteIm.on("resultSaveImage", function(){
                                                    var image = document.getElementById("imgP");
                                                    console.log(image);
                                                    image.src = 'data:image/png;base64,'+localStorage.getItem("imageLogged");}, this);
              }
              
              function onFail(f){
                  console.log("save img camera failed");
              }


          }

        }

    },


    editData: function(e){
      console.log("editing profile");
      this._name = document.getElementById("profileName").value;
      this._surname = document.getElementById("profileSurname").value;
      this._email = document.getElementById("profileEmail").value;
      $(".edit").removeAttr("disabled");
      $("#editData").attr("style","display:none");
      $("#deleteData , #saveData").attr("style","display:inline-block");

    },

    cancellChanges: function(e){
        $("#editData , #deleteData , #saveData").removeAttr("style");

        document.getElementById("profileName").value =this._name;
        document.getElementById("profileSurname").value = this._surname;
        document.getElementById("profileEmail").value = this._email;
        $(".edit").attr("disabled","disabled");
        $(".errorReg.data").removeAttr("style");

    },

    editPassword: function(e){
      console.log("editing");
      $(".editPass").removeAttr("disabled");
      $("#editPassword").attr("style","display:none");
      $("#cancellChangePass , #savePassword").attr("style","display:inline-block");

    },

    cancellChangePass: function(e){
        $("#editPassword , #savePassword, #cancellChangePass").removeAttr("style");

        document.getElementById("profileOldPass").value ="";
        document.getElementById("profileNewPass").value ="";
        document.getElementById("profileConfirm").value ="";
        $(".editPass").attr("disabled","disabled");
        $(".errorReg.pass").removeAttr("style");
    },

    validateEditedData: function(e){
       $(".errorReg.data").removeAttr("style");
       var valid= true;
       var name = document.getElementById("profileName").value;
       var surname = document.getElementById("profileSurname").value;
       var email = document.getElementById("profileEmail").value;
       var emailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;
       
      // controlla che il nuovo nome non sia vuoto
       if(name=="" || name=="undefined") {
            $("#errName").attr("style","display:inline-block");
            valid=false;
          }

      // controlla che il nuovo surname non sia vuoto
       if(surname=="" || surname=="undefined"){
            $("#errSurname").attr("style","display:inline-block");
            valid = false;
       } 

        if (!emailExp.test(email) || (email == "") || (email == "undefined")) {
             console.log("err email");
             /*$("#errEmail").removeAttr("style");*/
             $("#errEmail").attr("style","display:block");
             document.formRegister.regEmail.select();
             valid = false;
          }  
       

      if (valid){
          $("#saveData , #editData, #deleteData").removeAttr("style");
          localStorage.setItem('nameLogged',name);
          localStorage.setItem('surnameLogged',surname);
          localStorage.setItem("emailLogged", email);
          $(".edit").attr("disabled", "disabled");
           this.utente.saveName(localStorage.getItem("idu"), name);
           this.utente.saveSurname(localStorage.getItem("idu"), surname);
           this.utente.saveEmail(localStorage.getItem("idu"), email);
           
         }
    },

    validateChangePassword: function(e){
        $(".errorReg.pass").removeAttr("style");
        var valid=true;
        var oldPass = document.getElementById("profileOldPass").value;
        var newPass = document.getElementById("profileNewPass").value;
        var confirm = document.getElementById("profileConfirm").value;
        
        /*if(oldPass!=localStorage.getItem("passwordLogged")){
            $("#errPassword").attr("style","display:inline-block");
              valid=false;
        } */

        if( newPass!=confirm || newPass.length < 5 ){
              $("#errConfirm").attr("style","display:inline-block");
              valid=false;
        } 
        if(valid)
            this.utente.changePasswordBaasbox(oldPass, newPass);

    },

    changePasswordDone: function(result){
        if(result){
            localStorage.setItem('passwordLogged',result);
            $("#editPassword , #savePassword , #cancellChangePass").removeAttr("style");
            document.getElementById("profileOldPass").value ="";
            document.getElementById("profileNewPass").value ="";
            document.getElementById("profileConfirm").value ="";
            $(".editPass").attr("disabled","disabled");
            $(".errorReg.pass").removeAttr("style");
           }
        else
          $("#errPassword").attr("style","display:inline-block");
    },

    goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });

    },

     saveData: function(result){
      if(result==null){
          console.log("save data error");
        }else{
            $("#editData").removeAttr("style");
            $("#saveData").attr("style","display:none");
        }
      }


  });

  return Profile;

});
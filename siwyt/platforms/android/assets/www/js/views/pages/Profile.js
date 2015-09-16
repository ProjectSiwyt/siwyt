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
            var navigation = document.getElementById("navigation");
            var header = document.getElementById("header");
            var settings = document.getElementById("settingsMenu");
            if (header.classList.contains('hide')) {
                header.classList.remove('hide');
            }
            if (navigation.classList.contains('hide')) {
                navigation.classList.remove('hide');
            };
            if (settings.classList.contains('hide')) {
                settings.classList.remove('hide');
            };
            document.getElementById("back").classList.add('hide');
            document.getElementById("title").innerHTML = "Profile";
            $(".profile-img").attr("src", localStorage.getItem("imgProfile"));


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
            this.utente.on("datiUtente", this.showDatiUtente, this);
            this.utente.on("changePasswordDone", this.changePasswordDone, this);

            //this.utente.on("resultData", this.showData, this);
            // carico i dati dell utente 
            //this.utente.requestData(idUtente);

            //this.utente.on("resultSaveDate",this.saveData, this);
            //this.utente.on("resultDeleteAccount", this.goOut, this);
            //this.utente.on("resultCheckPassword", this);
            //console.log(this.utente);
        },

        id: "profile",
        className: "i-g page scroll scroll-profile size",

        //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
        events: {
            "swipeRight": "goToHome",
            "tap #deleteAccount": "deleteAccount",
            "tap #editData": "editData",
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

        goOut: function(result) {
            console.log("result " + result);
            if (result) {
                localStorage.setItem('idu', null);
                Backbone.history.navigate("login", {
                    trigger: true
                });
            }
        },

        showData: function(result) {
            if (result != null) {
                console.log(result);

            }
        },

        startQuery: function(e) {
            this.utente.contaBacheche();
            this.utente.caricaDati();
            $("#uploadForm").submit(function(e) {
                e.preventDefault();
                var formObj = $(this);
                var formData = new FormData(this);
                BaasBox.uploadFile(formData)
                    .done(function(res) {
                        0
                        console.log("res ", res);
                    })
                    .fail(function(error) {
                        console.log("error ", error);
                    })
            });
        },


        showNumBachecheUtente: function(result) {
            console.log("num bacheche ytente" + result);
            document.getElementById("numBachecheUser").innerHTML = result;
            this.bacheca.contaBachecheResponsabile();
            this.numUser = result;

        },

        showNumBachecheResposnsabile: function(result) {
            console.log("num bacheche responsabile" + result);
            document.getElementById("numBachecheAdmin").innerHTML = result;
            this.bacheca.contaBachecheAmministratore();
            this.numAdmin = result;
        },

        showNumBachecheAmministratore: function(result) {
            console.log("num bacheche manager" + result);
            document.getElementById("numBachecheManager").innerHTML = result;
            var tot = this.numUser + this.numAdmin + result;
            document.getElementById("numTotBacheche").innerHTML = tot;

        },

        showDatiUtente: function(result) {
            console.log("result showDatiUtente ", result);
            document.getElementById("iscrizione").innerHTML = result.signUpDate.slice(0, 10);

        },




        deleteAccount: function(e) {
            var del = window.confirm("Are you sure you want to delete your account?");
            console.log(del);
            if (del)
                this.utente.deleteAccount(localStorage.getItem("idu"));

        },

        changeImg: function(e) {


            var THIS = this;
            console.log(THIS, "changeImg");
            navigator.notification.confirm(
                'Select source', // message
                THIS.getImg, // callback to invoke
                'Change Image', // title
                'Camera,Photo Gallery' // buttonLabels
            );
        },

        getImg: function(e) {
            var THIS = this;
            console.log(THIS, "getImg");
            // caricamento dell immagine dalla collezione di immagini
            if (e == 2) {
                console.log("PHOTOLIBRARY");
                navigator.camera.getPicture(saveImgAlbum, onFail, {
                    quality: 50,
                    targetWidth: 160,
                    targetHeight: 160,
                    encodingType: Camera.EncodingType.JPEG,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
                });

                function saveImgAlbum(img) {
                    console.log(img);
                    localStorage.setItem("imgProfile", img);
                    $(".profile-img").attr("src", img);
                    console.log("save image gallery");


                    var myBlob = new Blob([img], {
                        type: "imgProfile"
                    });

                    var reader = new FileReader();

                    reader.onload = function(event) {
                        /*var URL = event.target.result;
                        document.getElementById("lnkDownload").href = URL;*/
                    };
                    var i = new File();
                    i = reader.readAsDataURL(myBlob);

                    BaasBox.uploadFile(i)
                        .done(function(res) {
                            console.log("res ", res);
                        })
                        .fail(function(error) {
                            console.log("error ", error);
                        })
                }

                function onFail(e) {
                    console.log("save image gallery failed");
                }
            }

            // caricamento dell immagine direttamente dalla camera
            else {
                if (e == 1) {
                    console.log("Camera");
                    navigator.camera.getPicture(saveImgCamera, onFail, {
                        quality: 50,
                        targetWidth: 160,
                        targetHeight: 160,
                        destinationType: Camera.DestinationType.NATIVE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA
                    });

                    function saveImgCamera(DATA_URL) {
                        console.log("save img camera")
                        console.log(DATA_URL);
                    }

                    function onFail(f) {
                        console.log("save img camera failed");
                    }


                }

            }

        },

        saveImg: function(DATA_URL) {
            console.log(DATA_URL);
        },

        onFail: function(f) {
            console.log("change image failed");
        },


        editData: function(e) {
            console.log("editing profile");
            this._name = document.getElementById("profileName").value;
            this._surname = document.getElementById("profileSurname").value;
            this._email = document.getElementById("profileEmail").value;
            $(".edit").removeAttr("disabled");
            $("#editData").attr("style", "display:none");
            $("#deleteData , #saveData").attr("style", "display:inline-block");

        },

        cancellChanges: function(e) {
            $("#editData , #deleteData , #saveData").removeAttr("style");

            document.getElementById("profileName").value = this._name;
            document.getElementById("profileSurname").value = this._surname;
            document.getElementById("profileEmail").value = this._email;
            $(".edit").attr("disabled", "disabled");
            $(".errorReg.data").removeAttr("style");

        },

        editPassword: function(e) {
            console.log("editing");
            $(".editPass").removeAttr("disabled");
            $("#editPassword").attr("style", "display:none");
            $("#cancellChangePass , #savePassword").attr("style", "display:inline-block");

        },

        cancellChangePass: function(e) {
            $("#editPassword , #savePassword, #cancellChangePass").removeAttr("style");

            document.getElementById("profileOldPass").value = "";
            document.getElementById("profileNewPass").value = "";
            document.getElementById("profileConfirm").value = "";
            $(".editPass").attr("disabled", "disabled");
            $(".errorReg.pass").removeAttr("style");
        },

        validateEditedData: function(e) {
            $(".errorReg.data").removeAttr("style");
            var valid = true;
            var name = document.getElementById("profileName").value;
            var surname = document.getElementById("profileSurname").value;
            var email = document.getElementById("profileEmail").value;
            var emailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{2,})+\.)+([a-zA-Z0-9]{2,})+$/;

            // controlla che il nuovo nome non sia vuoto
            if (name == "" || name == "undefined") {
                $("#errName").attr("style", "display:inline-block");
                valid = false;
            }

            // controlla che il nuovo surname non sia vuoto
            if (surname == "" || surname == "undefined") {
                $("#errSurname").attr("style", "display:inline-block");
                valid = false;
            }

            if (!emailExp.test(email) || (email == "") || (email == "undefined")) {
                console.log("err email");
                /*$("#errEmail").removeAttr("style");*/
                $("#errEmail").attr("style", "display:block");
                document.formRegister.regEmail.select();
                valid = false;
            }


            if (valid) {
                $("#saveData , #editData, #deleteData").removeAttr("style");
                localStorage.setItem('nameLogged', name);
                localStorage.setItem('surnameLogged', surname);
                localStorage.setItem("emailLogged", email);
                $(".edit").attr("disabled", "disabled");
                this.utente.saveName(localStorage.getItem("idu"), name);
                this.utente.saveSurname(localStorage.getItem("idu"), surname);
                this.utente.saveEmail(localStorage.getItem("idu"), email);

            }
        },

        validateChangePassword: function(e) {
            $(".errorReg.pass").removeAttr("style");
            var valid = true;
            var oldPass = document.getElementById("profileOldPass").value;
            var newPass = document.getElementById("profileNewPass").value;
            var confirm = document.getElementById("profileConfirm").value;

            /*if(oldPass!=localStorage.getItem("passwordLogged")){
                $("#errPassword").attr("style","display:inline-block");
                  valid=false;
            } */

            if (newPass != confirm || newPass.length < 5) {
                $("#errConfirm").attr("style", "display:inline-block");
                valid = false;
            }
            if (valid)
                this.utente.changePasswordBaasbox(oldPass, newPass);

        },

        changePasswordDone: function(result) {
            if (result) {
                localStorage.setItem('passwordLogged', result);
                $("#editPassword , #savePassword , #cancellChangePass").removeAttr("style");
                document.getElementById("profileOldPass").value = "";
                document.getElementById("profileNewPass").value = "";
                document.getElementById("profileConfirm").value = "";
                $(".editPass").attr("disabled", "disabled");
                $(".errorReg.pass").removeAttr("style");
            } else
                $("#errPassword").attr("style", "display:inline-block");
        },

        goToHome: function(e) {
            Backbone.history.navigate("homeSiwyt", {
                trigger: true
            });

        },

        saveData: function(result) {
            if (result == null) {
                console.log("save data error");
            } else {
                $("#editData").removeAttr("style");
                $("#saveData").attr("style", "display:none");
            }
        }


    });

    return Profile;

});

//numero degli oggetti mobili
//number of draggable objects
var moverno=1
//riferimento all'area di visualizzazione della posizione di trascinamento
//reference to the area where the position is shown during dragging
var dragHint=null;
//riferimenti all'oggetto in fase di trascinamento e alla sua posizione, dimensione e bordo iniziali
//reference to the object being dragged, its position, dimensions and initial border
var drag_object=null, drag_start_pos=null; drag_start_size=null, drag_start_border="";
//posizione del mouse all'inizio del trascinamento
//mouse position when dragging has started
var drag_start_mouse_pos=null;
//listener iniziali degli eventi per il documento
//initial document event listeners
var saveMM, saveMU;

//calcola la posizione del mouse rispetto al documento
//calculates the mouse position w.r.t. the document
function getMousePos(e)
{
  if (e.pageX || e.pageY) {
    return{x:e.pageX, y:e.pageY};
  } else if (e.clientX || e.clientY) {
    //usiamo le proprietà nonstandard scrollLeft e scrollTop per determinare la porzione di documento visualizzata nel browser
    //we use the scrollLeft and scrollTop properties to determine the part of the document shown in the browser
    return {x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
          y: e.clientY + document.body.scrollTop  + document.documentElement.scrollTop};
  } else return {x:0, y:0}
}

//mostra il tooltip
//shows the tooltip
function addHint(element,initpos,text)
{
  //se è già presente, lo nascondiamo
  //if it already exists, we hide it
  removeHint();
  //se è già stato inserito nel documento, ci limitiamo a mostrarlo
  //if it has been already added to the document, we show it
  if (dragHint) {
    dragHint.style.display="block";
  } else {
    //altrimenti creiamo una div con le caratteristiche richieste e la inseriamo nel documento
    //otherwise we create a div with some cspecific css properties  and we append it to the document
    dragHint = document.createElement("div");
    dragHint.style.position="absolute";
    dragHint.id="dragHint";
    document.body.appendChild(dragHint);
  }
  //posizioniamo l'hint vicino al mouse e ne aggiorniamo il testo
  //potition the hint close to the mouse and update its text
  updateHint(text,(initpos.x+10),(initpos.y+10));
}

//rimozione del tooltip (se presente)
//removes the tooltip  (if present)
function removeHint()
{
  //nascondiamo il tooltip
  //hide the tooltip div
  if (dragHint) {
    dragHint.style.display="none";;
  }
}

//aggiornamento del tooltip (posizione e testo)
//updates the tooltip (text and position)
function updateHint(text,posX,posY)
{ 
  if (dragHint) {
    dragHint.textContent=text;
    //posizioniamo il tooltip con i CSS (deve avere posizionamento assoluto!)
    //use CSS to position the tooltip (the div must be absolutely positioned!)
    if (posX && posY) {
      dragHint.style.left = (posX)+"px";
      dragHint.style.top = (posY)+"px";
    }
  }
}


//gestore dell'evento mousedown: inizia il trascinamento o il ridimensionamento
//mousedown event handler: starts dragging or resizing
function startDrag(e)
{
  //salviamo gli handlers correnti del documento. Li sovrascriveremo completamente con i nostri
  //save the current document event handlers. We will overwrite them with ours
  saveMM = document.onmousemove;
  saveMU = document.onmouseup;
  
  //oggetto da spostare/ridimensionare
  //object to drag or resize
  drag_object = e.target; 
  //posizione iniziale del mouse
  //initial mouse psition
  drag_start_mouse_pos = getMousePos(e); 
  //posizione iniziale dell'oggetto
  //initial object position
  drag_start_pos = {x:drag_object.offsetLeft,y:drag_object.offsetTop}; 
  //dimensioni iniziali dell'oggetto      
  //initial object size
  drag_start_size = {w:drag_object.offsetWidth,h:drag_object.offsetHeight}; 
  //bordo iniziale dell'oggetto     
  //initial object border
  drag_start_border = drag_object.style.border; 
  drag_object.style.border = "2px dashed red";
    
  //determiniamo dalla posizione del mouse se è richiesto uno spostamento o un ridimensionamento
  //determine from the mouse postion if the object is being dragged or resized
  if ((drag_start_mouse_pos.x-drag_start_pos.x >= drag_start_size.w-10) && (drag_start_mouse_pos.y-drag_start_pos.y >= drag_start_size.h-10)) {
    //attiviamo la modalità "ridimensiona"
    //activate the resize mode
    dragmode = 2;   
    //impostiamo il cursore appropriato
    //set the corresponding cursor
    drag_object.style.cursor = "se-resize"; 
    
  } else {
    //attiviamo la modalità "sposta"
    //activate the move mode
    dragmode = 1;
    //impostiamo il cursore appropriato
    //set the corresponding cursor
    drag_object.style.cursor = "move"; 
  }
  
  //creiamo il tooltip
  //create the tooltip
  addHint(drag_object,drag_start_mouse_pos,(dragmode==1?"move":"resize"));
  
  //agganciamo i gestori del mouse al documento. In questo modo potremo seguire i movimenti del mouse anche al di fuori dell'oggetto
  //questo è utile nel caso eventi esterni (ad esempio del sistema operativo) provochino lo spostamento del mouse fuori dall'oggetto 
  //senza notificarlo a javascript
  //set our mouse handlers on the document object. In this way, we can follow the mouse movements even if it exits from the object
  //this is useful when external events (e.g., from the OS) may move the mouse outside the object or the browser without notifying it
  //to the script
  document.onmousemove=drag;
  document.onmouseup=endDrag;
}

//gestore dell'evento mousemove: sposta o ridimensiona l'oggetto
//mousemove event handler: moves or resizes the object
function drag(e)
{
  //posizione corrente del mouse
  //current mouse position
  drag_current_mouse_pos = getMousePos(e);
  switch (dragmode) {
  //spostamento
  //move
  case 1:
    //calcoliamo la nuova posizione dell'oggetto misurando lo spostamento del mouse dalla sua posizione iniziale
    //calculate the new object position using the mouse distance from its initial position
    var newX = drag_start_pos.x + (drag_current_mouse_pos.x - drag_start_mouse_pos.x);
    var newY = drag_start_pos.y + (drag_current_mouse_pos.y - drag_start_mouse_pos.y);
    //e la impostiamo sull'oggetto
    //and set it in the object
    drag_object.style.left = newX+"px";
    drag_object.style.top = newY+"px";
    
    //aggiornaimo il tooltip
    //update the tooltip
    updateHint(drag_object.style.left + "," + drag_object.style.top,drag_current_mouse_pos.x+10,drag_current_mouse_pos.y+10);
    
    break;
  //ridimensionamento
  //resize
  case 2:
    //calcoliamo la nuova dimensione dell'oggetto misurando lo spostamento del mouse dalla sua posizione iniziale
    //calculate the new object size using the mouse distance from its initial position
    var newW = drag_start_size.w + (drag_current_mouse_pos.x - drag_start_mouse_pos.x);
    var newH = drag_start_size.h + (drag_current_mouse_pos.y - drag_start_mouse_pos.y);
    //e la impostiamo sull'oggetto
    //and set it in the object
    drag_object.style.width = newW+"px";
    drag_object.style.height = newH+"px";
    
    //aggiornaimo il tooltip
    //update the tooltip
    updateHint(drag_object.style.width + " X " + drag_object.style.height,drag_current_mouse_pos.x+10,drag_current_mouse_pos.y+10);
    
    break;
  } 
}

//gestore dell'evento mouseup: termina il trascinamento o il ridimensionamento
//mouseup event handler: ends the dragging or resizing
function endDrag(e)
{
  //ripristiniamo i precedenti handlers del documento
  //restore the original document event handlers
  document.onmousemove=saveMM;
  document.onmouseup=saveMU;
  
  //ripristiniamo il bordo dell'oggetto
  //restore the object border
  drag_object.style.border = drag_start_border; 
  
  //ripristiniamo il cursore
  //restore the cursor
  drag_object.style.cursor = "auto"; 
  
  //rimuoviamo il tooltip
  //remove the tooltip
  removeHint();
}

//gestore dell'evento mousedown: gestisce anche la chiusura dell'oggetto
//nousedown event handler: also handles the "close object" action
function closeAndDrag(e)
{
  //posizione dell'oggetto cliccato
  //position of the clicked object
  elementOffset = {x:e.target.offsetLeft,y:e.target.offsetTop}; //posizione dell'oggetto
  //posizione del click
  //click position
  drag_current_mouse_pos = getMousePos(e);
  //in base alla differenza tra le due posizioni di sopra, capiamo in che punto dell'oggetto abbiamo cliccato
  //using the two positions above, determine where the object was clicked
  if ((drag_current_mouse_pos.x-elementOffset.x <= 10) && (drag_current_mouse_pos.y-elementOffset.y <= 10)) {
    //se abbbiamo cliccato nell'angolo superiore sinistro, "chiudiamo" l'oggetto
    //if the click is in the upper left corner, "close" the object
    if (e.target.parentNode && e.target.parentNode.removeChild)
      //se possiamo rimuoverlo, lo rimuoviamo dal DOM
      //remove it from the DOM if possible
      e.target.parentNode.removeChild(e.target);
    else 
      //altrimenti ci limitiamo a nasconderlo
      //otherwise we simply hide it
      e.target.style.display="none" 
  } else {
    //per i click in altri punti, deleghiamo la gestione a startDrag
    //for clicks in other positions, delagate the event handling to startDrag
    startDrag(e);
  }
}
define(function(require) {

  var Backbone = require("backbone");
  var Bacheca = require("models/Bacheca");
  var Utils = require("utils");
  var Postit = require("models/Postit");

  var BachecaHome = Utils.Page.extend({

    constructorName: "BachecaHome",

    model: Postit,

    initialize: function() {
      // load the precompiled template
      this.template = Utils.templates.bacheca;
      moverno=1;
      document.getElementById("header").style.display="none";
      document.getElementById("navigation").style.display="none";
      spinner.stop();

      // here we can register to inTheDOM or removing events
      // this.listenTo(this, "inTheDOM", function() {
      //   $('#content').on("swipe", function(data){
      //     console.log(data);
      //   });
      // });
      // this.listenTo(this, "removing", functionName);

      // by convention, all the inner views of a view must be stored in this.subViews
    },

    id: "bachecahome",
    className: "i-g page",

    //ci chiama la funzione goToMap al tap sull'elemento con id goToMap
    events: {
      "tap #goToMap": "goToMap",
      "tap #aprimenu": "gestionemenu",
      "tap #addPostit": "aggiungi",
      "tap #goToHome": "goToHome",
      "tap #newPostit": "aggiungi2",
      "tap .postit": "goToComments",
      "longTap .postit": "gestionePopup",
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    goToMap: function(e) {
      Backbone.history.navigate("map", {
        trigger: true
      });
    },
    gestionemenu: function(e) {
      var elemento= document.getElementById("menu");
      if (elemento.style.display=='none'){
          elemento.style.display='block';
          elemento.style.color='blue';
          elemento.style.transform='translate3d(40px, 40px, 40px)';
      }
      else{
          elemento.style.display='none';  
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    aggiungi2: function(e) {
        var newobj = document.createElement("div");
        newobj.className="moveable block";
        //ci assicuriamo che sia posizionato in maniera assoluta
        //ensure it is absolutely positioned
        newobj.style.position="absolute";
        newobj.style.left=(moverno*10)+"px";
        newobj.style.top=(moverno*10+50)+"px";
        newobj.style.width="100px";
        newobj.style.height="50px";
        newobj.style.border="1px solid black";
        newobj.id="mover"+moverno;
        //le assegniamo il listener per l'evento mousedown
        //assign the mousedown handler to the object
        newobj.onmousedown = closeAndDrag;
        newobj.textContent = "POSTIT"+(moverno++);
        //la inseriamo nel documento
        //add the object to the document
        document.getElementById("contenutoBacheca").appendChild(newobj);
    },
     aggiungi: function(e) {
        var newobj = document.createElement("div");
        newobj.className="moveable block";
        //ci assicuriamo che sia posizionato in maniera assoluta
        //ensure it is absolutely positioned
        newobj.style.position="absolute";
        newobj.style.left=(moverno*10)+"px";
        newobj.style.top=(moverno*10+50)+"px";
        newobj.style.width="100px";
        newobj.style.height="50px";
        newobj.style.border="1px solid black";
        newobj.id="mover"+moverno;
        //le assegniamo il listener per l'evento mousedown
        //assign the mousedown handler to the object
        newobj.onmousedown = closeAndDrag;
        newobj.textContent = "POSTIT"+(moverno++);
        //la inseriamo nel documento
        //add the object to the document
        document.getElementById("contenutoBacheca").appendChild(newobj);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    goToHome: function(e) {
      Backbone.history.navigate("homeSiwyt", {
        trigger: true
      });
      document.getElementById("header").style.display='block';
    },
    goToComments: function(e){
        alert("goToComments");
    },
    gestionePopup: function(e){
      if(document.getElementById("popupPostit"+e.currentTarget.id).style.display=="none"){
          document.getElementById("popupPostit"+e.currentTarget.id).style.display="block";
      }
      else{
        document.getElementById("popupPostit"+e.currentTarget.id).style.display="none";
      }
      console.log(e.currentTarget.id);
    }
  });

  return BachecaHome;

});
/*

I parametri:

L'id del bottone per il parse.
L'id della textarea (code mirror editor) con il codice.
L'id dell'iframe per la preview dell'html generato.
	
*/


var ROOM = function(btn1, tbox1, iframe1) {
	Array.prototype.foreach=function(fnc){	/* have to account for foreach in all arrays objects this */
		for(var i=0;i<this.length;i++){
			fnc(this[i]);
		}
	}
	var rooms={
		code:"var room=[];\r\n\r\n",
		firstRoom:"",
		room:[],
		curRoom:"",
		init:function(){
			/*
			rooms.code="var room=[];\r\n\r\n";
			rooms.firstRoom="";
			rooms.room=[];
			rooms.curRoom="";
			*/
			this.code="var room=[];\r\n\r\n";
			this.firstRoom="";
			this.room=[];
			this.curRoom="";
			console.log("qui entro");
		},
		items:{}
	}
	var code=[/* will have RegExp as key and hold associated functions */];
	code["^titolo\\s+[\\s\\S]+"]=function(txt){
		var t=txt.replace(/^titolo\s+/,"").replace(/\s+/g," ");
		rooms.gameTitle=t;
	};
	code["^ambiente\\s+[\\s\\S]+"]=function(txt){
		var t=txt.replace(/^ambiente\s+/,"");
		if(rooms.firstRoom=="")rooms.firstRoom=t;
		if(typeof rooms.room[t] != "object"){
			rooms.room[t]={
				name:t,
				look:"",
				content:[],
				exits:[]
			};
		}
		rooms.curRoom=t;
	}
	code["^uscite\\s+[\\s\\S]+"]=function(txt){
		var t=txt.replace(/^uscite\s+/,"").replace(/\s+/g," ");
		var ex=t.split(/,/g);
		rooms.room[rooms.curRoom].exits=ex.join("','").replace(/' /g,"'");
	};
	code["^oggetti\\s+[\\s\\S]+"]=function(txt){
		var t=txt.replace(/^oggetti\s+/,"").replace(/\s+/g," ");
		var ex=t.split(/,/g);
		rooms.room[rooms.curRoom].content=ex.join("','").replace(/' /g,"'");
	};
	code["^descrizione\\s+[\\s\\S]+"]=function(txt){
		var ex=txt.replace(/^descrizione\s+/,"").replace(/\s+/g," ");
		rooms.room[rooms.curRoom].look=ex;
	};
	code["^oggetto\\s+[\\s\\S]+"]=function(txt){
		var ex=txt.replace(/^oggetto\s+/,"").replace(/\s+/g," ");
		rooms.lastItem = ex;
	};
	code["^cambia\\s+[\\s\\S]+"]=function(txt){
		var t = txt.replace(/^cambia\s+/,"").replace(/\s+/g," ");
		console.log(t);
		var rm = t.split(/,/)[0];
		t = t.split(/,/);
		console.log(t);
		//t.slice(0,1);
		//t.slice(0,1);
		t.shift();
		console.log(t);
		var d = t.join(",");
		if(!rooms.items[rooms.lastItem])
			rooms.items[rooms.lastItem]={};
		//console.log(rm);
		rooms.items[rooms.lastItem].toroom = rm.replace(/'/g,"\\'");
		//console.log(rm);
		//console.log(d);
		rooms.items[rooms.lastItem].newlook = d.replace(/'/g,"\\'");
		console.log(d);
		// qui abbiamo un piccolo errore su newlook
		// correggere espressione regolare
		//console.log(rooms);
	};
	code["^aggiungioggetti\\s+[\\s\\S]+"]=function(txt){
		var t = txt.replace(/^aggiungioggetti\s+/,"").replace(/\s+/g," ").replace(/,\s+/g,",").replace(/'/g,"\\'").split(/,/g);
		if(!rooms.items[rooms.lastItem])
			rooms.items[rooms.lastItem]={};
		rooms.items[rooms.lastItem].additems = t;
	};
	code["^aggiungiuscite\\s+[\\s\\S]+"]=function(txt){
		var t = txt.replace(/^aggiungiuscite\s+/,"").replace(/\s+/g," ").replace(/,\s+/g,",").replace(/'/g,"\\'").split(/,/g);
		if(!rooms.items[rooms.lastItem])
			rooms.items[rooms.lastItem]={};
		rooms.items[rooms.lastItem].addexits = t;
	};
	code["^elimina$"]=function(txt){
		if(!rooms.items[rooms.lastItem])
			rooms.items[rooms.lastItem]={};
		rooms.items[rooms.lastItem].kill = true;
	};
	code["^punteggio\\s+[\\s\\S]+"]=function(txt){
		var t = txt.replace(/^punteggio\s+/,"").replace(/\s+/g,"");
		if(!rooms.items[rooms.lastItem])
			rooms.items[rooms.lastItem]={};
		rooms.items[rooms.lastItem].score = t;
	};
	code["^messaggio\\s+[\\s\\S]+"]=function(txt){
		var t = txt.replace(/^messaggio\s+/,"").replace(/\s+/g," ");
		if(!rooms.items[rooms.lastItem])
			rooms.items[rooms.lastItem]={};
		rooms.items[rooms.lastItem].msg = t.replace(/'/g,"\\'");
	};
	code["^messaggioglobale\\s+[\\s\\S]+"]=function(txt){
		var t = txt.replace(/^messaggioglobale\s+/,"").replace(/\s+/g," ");
		if(!rooms.items[rooms.lastItem])
			rooms.items[rooms.lastItem]={};
		rooms.items[rooms.lastItem].gmsg = t.replace(/'/g,"\\'");
	};
	code["^donow$"]=function(txt){
		var t = txt.replace(/^donow\s+/,"").replace(/\s+/g," ");
		if(!rooms.items[rooms.lastItem])
			rooms.items[rooms.lastItem]={};
		rooms.items[rooms.lastItem].donow = true;
	};
	function parse(n){
		for(var i in code){
			var re=new RegExp(i,"i");
			if(re.test(n)){
				code[i](n);
			}
		};
	}
	/* the bulk of the game is one string */
	var gamestart="<"+"!doctype html"+">\r\n<" +"html"+ ">\r\n \
<title>[TITLE]</title>\r\n \
<style>\r\n \
body {margin:0px; font-size:11pt; font-family:Chalkboard, Comic Sans MS, Comic Sans, TSCu_Comic; background:black;}\r\n \
.look {position:relative;height:80px; font-size:16pt;font-family:Tempus Sans ITC, Tempus Sans, Purisa, Verdana; background:black; color:white;padding:10px;}\r\n \
.see {font-size:18pt;font-family:Tempus Sans ITC, Tempus Sans, Purisa, Verdana; background:black; color:yellow;padding:10px;}\r\n \
.go {font-family:Tempus Sans ITC, Tempus Sans, Purisa, Verdana; background:navy; color:#66ccff;padding:10px;}\r\n \
a {color: white}\r\n \
.inv {font-family:Tempus Sans ITC, Tempus Sans, Purisa, Verdana; background:white; color:navy;padding:10px;border:solid 2px black;}\r\n \
.inv a {color:red;font-weight:bold;}\r\n \
.score {font-size:18pt;font-family:Tempus Sans ITC, Tempus Sans, Purisa, Verdana; background:black; color:yellow;padding:10px;text-align:right;}\r\n \
h1 {padding-left:10px;background:#fff;color:#000;}\r\n \
</style>\r\n \
<body>\r\n \
<h1>[TITLE]</h1>\r\n \
<div id=\"game\"></div>\r\n \
<scr" +"ipt>\r\n \
var $=function(n){return document.getElementById(n)}\r\n \
[game] \
room.items={};\r\n \
room.curRoom;\r\n \
room.score=0;\r\n \
var inventory=[];\r\n \
function grab(ob,item){\r\n \
 	inventory[item]=1;\r\n \
	var oc=ob.content;\r\n \
	for(var i=0;i<oc.length;i++){\r\n \
		if(oc[i]==item){\r\n \
			oc.splice(i,1);\r\n \
			break;\r\n \
		}\r\n \
	}\r\n \
	if(room.items[item] && room.items[item].donow){\r\n \
		room['items'][item]();\r\n \
		delete inventory[item];\r\n \
	}\r\n \
	play(ob);\r\n \
}\r\n \
function play(ob,n){\r\n \
	room.curRoom = ob;\r\n \
	if(n){\r\n \
		if(room['items'][n]){\r\n \
			room['items'][n]();\r\n \
		}else{\r\n \
			ob.content.push(n);\r\n \
			delete inventory[n];\r\n \
		}\r\n \
	}\r\n \
 	var s=\"<div class='score' id='score'>PUNTEGGIO: \"+room.score+\"</div>\"\r\n \
	s+=\"<div class='look'>\"+ob.look+\"</div>\"\r\n \
	s+=\"<div class='see'>Qui vedi: \"\r\n \
	for(var i=0;i<ob.content.length;i++){\r\n \
		if(!(ob.content[i]==null || ob.content[i].replace(/\s/g,\"\")==\"\"))\r\n \
			s += \"<a href='#' onclick='grab(room[\\\"\"+ob.name+\"\\\"],\\\"\"+ob.content[i]+\"\\\");return false;'>[\"+ob.content[i]+\"]</a> \";\r\n \
	}\r\n \
	s+=\"</div>\"\r\n \
	s+=\"<div class='go'>Da qui puoi andare a: \"\r\n \
	for(var i=0;i<ob.exits.length;i++){\r\n \
		s += \"<a href='#' onclick='play(room[\\\"\"+ob.exits[i]+\"\\\"]);return false;'>[\"+ob.exits[i]+\"]</a> \";\r\n \
	}\r\n \
	s+=\"</div>\"\r\n \
	s+=\"<div class='inv'>I tuoi oggetti: \"\r\n \
 	for(var i in inventory){\r\n \
		if(i!=\"foreach\")\r\n \
		s += \"<a href='#' onclick='play(room[\\\"\"+ob.name+\"\\\"],\\\"\"+i+\"\\\");return false;'>[\"+i+\"]</a> \";\r\n \
	}\r\n \
	s+=\"</div>\"\r\n \
	$('game').innerHTML=s;\r\n \
}\r\n \
[INV]\r\n \
play(room['[firstRoom]'])\r\n \
</scr" +"ipt>\r\n \
</body" +">\r\n</html>";
	/* end of the game string */

var game;

	var $=function(n){return document.getElementById(n)}
	//$(btn1).flag=true;
	function setup(){
		$(btn1).onclick=function(){
				/*
				if (!($(btn1).flag)) {
					rooms.init();
					console.log(rooms.code);
				};
				*/
				rooms.init();
				game = gamestart;
				//console.log("test");
				//console.log($(tbox1).value);
				var a = $(tbox1).value.replace(/\r/g,"").split(/\n/g);
				//rooms.init();
				//console.log($(tbox1).value);
				a.foreach(parse);
				for(var i in rooms.room){
					if(i!="foreach"){
						rooms.code+="room['"+i+"']={};\r\n \
						room['"+i+"'].name=\""+rooms.room[i].name+"\";\r\n \
						room['"+i+"'].look=\""+rooms.room[i].look+"\";\r\n \
						room['"+i+"'].content=['"+rooms.room[i].content+"'];\r\n \
						room['"+i+"'].exits=['"+rooms.room[i].exits+"'];\r\n\r\n";
					}
				}
				console.log(rooms.code);
				game = game.replace(/\[game\]/,rooms.code).replace(/\[firstRoom\]/,rooms.firstRoom);
				//console.log(game);
				var s="";
				//console.log(rooms);
				for(var i in rooms.items){
					s+= "\r\n room.items['"+i+"']=function(){\r\n";
					if(rooms.items[i].toroom){
						s+="\tif(room.curRoom.name=='"+rooms.items[i].toroom+"'){\r\n";
						if(rooms.items[i].newlook)
							s+="\t\troom['"+rooms.items[i].toroom+"'].look='"+rooms.items[i].newlook+"';\r\n";
						if(rooms.items[i].additems){
							for(var j=0;j<rooms.items[i].additems.length;j++)
								s+="\t\troom['"+rooms.items[i].toroom+"'].content.push('"+rooms.items[i].additems[j]+"');\r\n";
						}
						if(rooms.items[i].addexits){
							for(var j=0;j<rooms.items[i].addexits.length;j++)
								s+="\t\troom['"+rooms.items[i].toroom+"'].exits.push('"+rooms.items[i].addexits[j]+"');\r\n";
						}
						if(rooms.items[i].kill){
							s+="\t\tdelete inventory['"+i+"'];\r\n"+
							"\t\tdelete room['items']['"+i+"'];\r\n";
						}
						if(rooms.items[i].score)
							s+="\t\troom.score+="+rooms.items[i].score+";\r\n";
						if(rooms.items[i].msg)
							s+="\t\talert('"+rooms.items[i].msg+"');\r\n";
						s+="\t}\r\n";
					}
					if(rooms.items[i].gmsg)
						s+="\talert('"+rooms.items[i].gmsg+"');\r\n";
					s+=" }\r\n";
					if(rooms.items[i].donow){
						s+=" room.items['"+i+"'].donow=true;\r\n";
					}
				}
				
				//console.log(s);
				
				//console.log(game);
				game = game.replace(/\[INV\]/,s).replace(/\[TITLE\]/g,function(){return rooms.gameTitle||"A ROOMS GAME"});
				//console.log(game);
				//console.log(game);
				
				//console.log(game);
				
				var previewFrame = document.getElementById(iframe1);
				var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
				preview.open();
				preview.write(game);
				preview.close();
				
				//$(btn1).flag=false;
				
			}
		

		}
			
	setup();
}

var user = {};


var clientSocket = io("http://localhost:3000/");

clientSocket.on("disconnect", function(){
	setTitle("Disconnected");
});
 
 clientSocket.on("connect", function(){
 	clientSocket.emit(console.log("something"));
 });

 clientSocket.on("message", function(message){
 	communicationMessage(message);
 });

clientSocket.on("chat", function( message ){
	printMessage(message);
});

window.onload = function () {
//initially only display the username panel
var messageDivision = document.getElementById("messageDivision");
messageDivision.style.display = "none";

//once username is entered, hide the username form and only show the message form
var usernameForm = document.getElementById("username");
usernameForm.onsubmit = function() {	
usernameForm.style.display = "none";
messageDivision.style.display = "block";
user = document.getElementById( "nickname").value;
console.log(`inside userform submit ${user}`);
//printMessage(userName.value);
return false;
}

clientSocket.on("getdataFromDB", function( items ) {
	for (var i = 0; i < items.length ; i++ ) {
		printMessage(items[i]);
	}
});

var messageForm = document.getElementById("messageform");
messageForm.onsubmit = function(event) {
	event.preventDefault();
	var message = {};
	var chatMessage = document.getElementById( "message");
	message['message'] = chatMessage.value;
	message['username'] =  user;
	message['timestamp'] = Date();
	printMessage(message);
	clientSocket.emit("chat", message);
	chatMessage.value = '';
	chatMessage.focus();
	return false;
}


}

function setTitle(title) {
    document.querySelector('h1').innerHTML = title;
}

function communicationMessage(message) {
    var p = document.createElement('p');
    p.innerText = message;
    document.querySelector("#username").appendChild(p);
}

printMessage.counter = 0;
function printMessage(message) {
	printMessage.counter = printMessage.counter + 1;
	var div = document.createElement('div');
	div.setAttribute("id","format_div_"+ printMessage.counter);
	var p1 = document.createElement('p');
	p1.setAttribute("id","p1" + printMessage.counter);
	p1.innerText = message['username'] + ':';
	var p2 = document.createElement('p');
	p2.setAttribute("id","p2" + printMessage.counter);
	p2.innerText = message['message'];
	var p3 = document.createElement('p');
	p3.innerText = message['timestamp'];
	p3.setAttribute("id","p3" + printMessage.counter);

	div.appendChild(p1);
	div.appendChild(p2);
	div.appendChild(p3);
	var formNode = document.getElementById("messageform");
    document.querySelector("#messageDivision").insertBefore(div,formNode);
}


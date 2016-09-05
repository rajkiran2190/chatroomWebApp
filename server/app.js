var express =  require('express');
var app = express();
var http = require('http');
var server = http.createServer(app).listen(3000);
var serverSocket = require('socket.io')(server);

//take mongodb to save the data into the database
var mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
  if(err) { return console.dir(err); }

var collection = db.collection('test');
app.use(express.static("../client"));


serverSocket.on("connection", function(clientSocket) {

	collection.find().toArray(function(err, items) {
        // Emit the messages saved in the database to each client.
        clientSocket.emit( "getdataFromDB", items );
	});

	clientSocket.on("chat", function(message){
        //whenever you receive a "chat" request from the client save that into db and also broadcast it to rest of the clients
		clientSocket.broadcast.emit("chat", message);
		//push this into the database
		collection.insert(message);
		console.log(message);
	});
    // Adding debug messages 
	// clientSocket.emit("message", "connection established with 3000 server socket" );
});

});

console.log( " starting the http server at 3000 ");


	


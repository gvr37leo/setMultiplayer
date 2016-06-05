var express = require("express");
var app = express();
var server = require("http").createServer(app);
var port = process.env.PORT || 8000;
var io = require("socket.io")(server);


var Room = require('./Room');

app.use(express.static('client'));

server.listen(port, function(){
    console.log("listening on port " + port);
});
var room = new Room();
room.host(io);

//console.log(deck.findSets());//.forEach(function(item){console.log(item)});
//add card (handsize) if there are no more options available and the deck isn't empty yet
//add a 4th attribute and think of how to put it in html/css(background color(darker, lighter other color))
//maybe do something with playerid count, if you do find a good reason
//reason is so that you can put it on a badge(probably a smarter idea is to modulo the number on the badge and not the actual id)
//weird behaviour with scoreboaard not immidiatly highlighting your score
//maybe add overflow to size attribute
//add more colors
//deck class
//very maybe rooms (altough it would be a cool challenge)
//managed to select 3 things somehow
//ternary attribuut methode uitwerken(of recursief or whatever)
//mercyTimer?
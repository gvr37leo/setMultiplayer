var express = require("express");
var app = express();
var server = require("http").createServer(app);
var port = process.env.PORT || 8000;
var io = require("socket.io")(server);


var Deck = require('./Deck');
var Player = require('./Player');

app.use(express.static('client'));

var connectionCounter = 0;
server.listen(port, function(){
    console.log("listening on port " + port);
});

var players = {};


var deck = new Deck();
deck.shuffle();
var timeSinceLastSetFound = 0;
setInterval(function(){
    timeSinceLastSetFound++;
    //if(timeSinceLastSetFound > 10)
},1000);

console.log(deck.findSets());//.forEach(function(item){console.log(item)});
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

//maybe use selected array in players object to determine which cards are selected to prevent duplicate data
//at client at selected attribute to selected cards
//maybe would require to much looping but would save looping on player deletion

io.on("connection",function(socket){
    var sessionId = connectionCounter;
    console.log("client connected: " + socket.handshake.address);
    console.log("with sessionID: " + sessionId);
    players[sessionId] = new Player();
    connectionCounter++;
    deck.setAllCardsToUnselected(sessionId);
    emitUpdate();
    socket.emit('handshake',sessionId);

    socket.on("select", function (data) {//data{selected:int[0-9]}
        var card = deck.cards[rangeCap(data.selected,0,deck.handSize)];
        var player = players[sessionId];
        if(card.selected[sessionId]){
            player.selectedSize--;
            card.selected[sessionId] = !card.selected[sessionId];
        }else{
            card.selected[sessionId] = !card.selected[sessionId];
            player.selected[player.selectedSize] = data.selected;
            player.selectedSize++;

            if(players[sessionId].selectedSize == 3){
                if(Deck.isSet(deck.cards[player.selected[0]], deck.cards[player.selected[1]], deck.cards[player.selected[2]])){
                    deck.cards[player.selected[0]] = deck.cards[deck.graveyardPointer];
                    deck.cards[player.selected[1]] = deck.cards[deck.graveyardPointer - 1];
                    deck.cards[player.selected[2]] = deck.cards[deck.graveyardPointer - 2];
                    deck.graveyardPointer -= 3;
                    player.score++;

                    var sets = deck.findSets();
                    if(sets.length == 0){//no solutions available
                        deck = new Deck();
                        deck.shuffle();
                        sets = deck.findSets();
                        console.log("deck reset");
                    }
                    timeSinceLastSetFound = 0;
                    console.log(sets);
                }
                deck.cards[player.selected[0]].selected[sessionId] = false;
                deck.cards[player.selected[1]].selected[sessionId] = false;
                deck.cards[player.selected[2]].selected[sessionId] = false;
                player.selected = [0,0,0];
                //deselect for all players
                player.selectedSize = 0;

            }
        }
        emitUpdate();
    });

    socket.on("disconnect", function () {
        console.log("client disconnected:" + socket.handshake.address);
        console.log("with sessionID: " + sessionId);
        deck.deleteSelection(sessionId);
        delete players[sessionId];
        emitUpdate();
    });
});

function emitUpdate(){
    io.sockets.emit("update",{
        hand:deck.getHand(),
        players:players,
        timeSinceLastSetFound:timeSinceLastSetFound
    });
}

//function cap(val, cap){
//    if(val > cap) return cap;
//    return val;
//}
//
var rangeCap = function(val,low,high){
    if(val < low)return low;
    if(val > high)return high;
    return val;
};
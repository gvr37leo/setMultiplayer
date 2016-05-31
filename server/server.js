var express = require("express");
var app = express();
var server = require("http").createServer(app);
var port = process.env.PORT || 8000;
var io = require("socket.io")(server);

var Card = require('./Card');
var Player = require('./Player');

app.use(express.static('client'));

var connectionCounter = 0;
server.listen(port, function(){
    console.log("listening on port " + port);
});

var players = {};

var deck = Card.generateCards();
var graveyardPointer = deck.length - 1;
Card.shuffle(deck);
var handSize = 9;
console.log(Card.findSets(deck.slice(0,cap(handSize,graveyardPointer + 1))));//.forEach(function(item){console.log(item)});
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

io.on("connection",function(socket){
    var sessionId = connectionCounter;
    console.log("client connected: " + socket.handshake.address);
    console.log("with sessionID: " + sessionId);
    players[sessionId] = new Player();
    connectionCounter++;
    setAllCardsToUnselected(sessionId);

    io.sockets.emit("update",{
        deck:deck,
        players:players,
        graveyardPointer:graveyardPointer
    });

    socket.emit('handshake',sessionId);

    socket.on("select", function (data) {
        var card = deck[rangeCap(data.selected,0,9)];
        var player = players[sessionId];
        if(card.selected[sessionId]){
            player.selectedSize--;
            card.selected[sessionId] = !card.selected[sessionId];
        }else{
            card.selected[sessionId] = !card.selected[sessionId];
            player.selected[player.selectedSize] = data.selected;
            player.selectedSize++;

            if(players[sessionId].selectedSize == 3){
                if(Card.isSet(deck[player.selected[0]], deck[player.selected[1]], deck[player.selected[2]])){
                    deck[player.selected[0]] = deck[graveyardPointer];
                    deck[player.selected[1]] = deck[graveyardPointer - 1];
                    deck[player.selected[2]] = deck[graveyardPointer - 2];
                    graveyardPointer -= 3;
                    player.score++;

                    var sets = Card.findSets(deck.slice(0,cap(handSize,graveyardPointer + 1)));
                    if(sets.length == 0){
                        deck = Card.generateCards();
                        Card.shuffle(deck);
                        graveyardPointer = deck.length - 1;
                        sets = Card.findSets(deck.slice(0,cap(handSize,graveyardPointer + 1)));
                    }
                    console.log(sets);
                }
                deck[player.selected[0]].selected[sessionId] = false;
                deck[player.selected[1]].selected[sessionId] = false;
                deck[player.selected[2]].selected[sessionId] = false;
                player.selected = [0,0,0];
                //deselect for all players
                player.selectedSize = 0;
            }
        }

        io.sockets.emit("update",{
            deck:deck,
            players:players,
            graveyardPointer:graveyardPointer
        })
    });

    socket.on("disconnect", function () {
        console.log("client disconnected:" + socket.handshake.address);
        console.log("with sessionID: " + sessionId);
        deleteSelection(sessionId);
        delete players[sessionId];
        io.sockets.emit("update",{
            deck:deck,
            players:players,
            graveyardPointer:graveyardPointer
        });
    });
});

function setAllCardsToUnselected(sessionId){
    deck.forEach(function(card){
        card.selected[sessionId] = false;
    })
}

function deleteSelection(sessionId){
    deck.forEach(function(card){
        delete card.selected[sessionId];
    })
}

function cap(val, cap){
    if(val > cap) return cap;
    return val;
}

var rangeCap = function(val,low,high){
    if(val < low)return low;
    if(val > high)return high;
    return val;
};
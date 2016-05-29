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
//Card.shuffle(deck);
//var handSize = 9;
//var selected = [0,0,0];
//var selectedSize = 0;

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
        var card = deck[data.selected];
        var player = players[sessionId];
        if(card.selected[sessionId]){//
            player.selectedSize--;//--
            card.selected[sessionId] = !card.selected[sessionId];//
        }else{
            card.selected[sessionId] = !card.selected[sessionId];//
            player.selected[player.selectedSize] = data.selected;//--
            player.selectedSize++;//

            if(players[sessionId].selectedSize == 3){//
                if(Card.isSet(deck[player.selected[0]], deck[player.selected[1]], deck[player.selected[2]])){
                    deck[player.selected[0]] = deck[graveyardPointer];
                    deck[player.selected[1]] = deck[graveyardPointer - 1];
                    deck[player.selected[2]] = deck[graveyardPointer - 2];
                    graveyardPointer -= 3;

                    player.score++;
                }
                deck[player.selected[0]].selected[sessionId] = false;
                deck[player.selected[1]].selected[sessionId] = false;
                deck[player.selected[2]].selected[sessionId] = false;
                player.selected = [0,0,0];
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
        deleteSelection();
        delete players[sessionId];
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
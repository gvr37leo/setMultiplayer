var Deck = require('./Deck');
var Player = require('./Player');

function Room(){
    //this.players = [];
    //this.deck = new Deck();
}

Room.prototype.host = function(io){
    var connectionCounter = 0;
    var players = {};

    var deck = new Deck();
    deck.shuffle();
    var timeSinceLastSetFound = 0;
    setInterval(function(){
        timeSinceLastSetFound++;
        //if(timeSinceLastSetFound > 10)
    },1000);

    io.on("connection",function(socket){
        var sessionId = connectionCounter;
        console.log("client connected: " + socket.handshake.address);
        console.log("with sessionID: " + sessionId);
        players[sessionId] = new Player();
        connectionCounter++;
        emitUpdate();
        socket.emit('handshake',sessionId);

        socket.on("select", function (data) {//data{selected:int[0-9]}
            data.selected = rangeCap(data.selected,0,deck.handSize);
            var player = players[sessionId];

            if(player.selected[data.selected]){
                player.selectedSize--;
                player.selected[data.selected] = !player.selected[data.selected];
                var hits = 0;// loop for deselection to make sure the right card gets deselected
                for(var x = 0; x < player.selected.length && hits < player.selectedSize; x++){
                    if(player.selected[x]){
                        player.handPointers[hits] = x;
                        hits++;
                    }
                }
            }else{
                player.selected[data.selected] = !player.selected[data.selected];
                player.handPointers[player.selectedSize] = data.selected;
                player.selectedSize++;

                if(player.selectedSize == 3){
                    if(Deck.isSet(deck.cards[player.handPointers[0]], deck.cards[player.handPointers[1]], deck.cards[player.handPointers[2]])){
                        for(var i = 0; i < deck.handSize; i++)deck.cards[player.handPointers[i]] = deck.cards[deck.graveyardPointer - i];
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
                    player.selected = [false,false,false,false,false,false,false,false,false];
                    player.handPointers = [0,0,0];
                    player.selectedSize = 0;

                }
            }
            emitUpdate();
        });

        socket.on("disconnect", function () {
            console.log("client disconnected:" + socket.handshake.address);
            console.log("with sessionID: " + sessionId);
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

    var rangeCap = function(val,low,high){
        if(val < low)return low;
        if(val > high)return high;
        return val;
    };
};

module.exports = Room;
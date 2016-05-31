var socket;
if(window.location.href == 'http://localhost:8000/')socket = io.connect("localhost:8000");
else socket = io.connect("https://setmulti.herokuapp.com/");
socket.emit('update');



var app = angular.module('app', []);

//color coded labels in header for selection
app.controller('ctrl',function($scope){
    $scope.deck = [];
    $scope.labelColors = ["default","success","info","warning","danger"];
    $scope.select = function(index){
        socket.emit('select',{
            selected:index
        });
    };
    $scope.getNumber = function(num) {
        return new Array(num);
    };


    socket.on('handshake', function(id){
        $scope.id = id;
    });

    socket.on('update', function (data) {
        console.log(data);
        $scope.deck = data.deck.splice(0, cap(9,data.graveyardPointer + 1));
        $scope.players = data.players;
        $scope.$apply();
        console.log(findSets($scope.deck).toString());
    });
});

function cap(val, cap){
    if(val > cap) return cap;
    return val;
}

function findSets(hand){
    var sets = [];
    for(var i = 0; i < hand.length - 2; i++){
        for(var j = i + 1; j < hand.length - 1; j++){
            for(var k = j + 1; k < hand.length; k++){
                if(isSet(hand[i],hand[j],hand[k])){
                    sets.push([i,j,k])
                }
            }
        }
    }
    return sets;
}

function isSet(a, b, c){
    for(var i = 0; i < 3; i++){
        if(!((a.attributes[i] == b.attributes[i] && a.attributes[i] == c.attributes[i]) ||
            (a.attributes[i] != b.attributes[i] && a.attributes[i] != c.attributes[i] && b.attributes[i] != c.attributes[i]))){
            return false;
        }
    }
    return true;
}
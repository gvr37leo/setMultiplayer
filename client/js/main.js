var socket;
if(window.location.href == 'http://localhost:8000/')socket = io.connect("localhost:8000");
else socket = io.connect("https://setmulti.herokuapp.com/");
socket.emit('update');



var app = angular.module('app', []);

//color coded labels in header for selection
app.controller('ctrl',function($scope){
    $scope.deck = [];
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
    });

    //var canvas = document.getElementById("zero");
    //var ctx = canvas.getContext("2d");
});

function cap(val, cap){
    if(val > cap) return cap;
    return val;
}
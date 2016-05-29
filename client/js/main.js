var socket;
if(window.location.href == 'http://localhost:8000/')socket = io.connect("localhost:8000");
else socket = io.connect("https://multiset.herokuapp.com/");
socket.emit('update');

var app = angular.module('app', []);

app.controller('ctrl',function($scope){
    $scope.deck = [];
    $scope.select = function(index){
        socket.emit('select',{
            selected:index
        });
    };


    socket.on('handshake', function(id){
        $scope.id = id;
    });

    socket.on('update', function (data) {
        console.log(data);
        $scope.deck = data.deck.splice(0, cap(9,data.graveyardPointer + 1));
        $scope.$apply();
    });
});

function cap(val, cap){
    if(val > cap) return cap;
    return val;
}
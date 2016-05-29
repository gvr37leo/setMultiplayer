var Vector = require('./Vector');

function Card(color,shape,quantity){
    this.position = new Vector(10,10);

    this.shape  = 0;
    this.color = color;
    this.shape = shape;
    this.quantity = quantity;


    this.selected = {};
}

Card.isSet = function(a, b, c){
    var propertys = ["color","shape","quantity"];
    for(var i = 0; i < propertys.length; i++){
        if(!((a[propertys[i]] == b[propertys[i]] && a[propertys[i]] == c[propertys[i]]) ||
        (a[propertys[i]] != b[propertys[i]] && a[propertys[i]] != c[propertys[i]] && b[propertys[i]] != c[propertys[i]]))){
            return false;
        }
    }
    return true;
};

Card.findSets = function(hand){
    var sets = [];
    for(var i = 0; i < hand.length - 2; i++){
        for(var j = i + 1; j < hand.length - 1; j++){
            for(var k = j + 1; k < hand.length; k++){
                if(Card.isSet(hand[i],hand[j],hand[k])){
                    sets.push([i,j,k])
                }
            }
        }
    }
    return sets;
};

Card.generateCards = function(){
    var cards = [];
    for(var color = 0; color < 3; color++){
        for(var shape = 0; shape < 3; shape++){
            for(var quantity = 0; quantity < 3; quantity++){
                cards.push(new Card(color,shape,quantity));
            }
        }
    }
    return cards;
};

Card.shuffle = function(cards){
    var range = cards.length - 1;
    while(range >= 0){
        swap(cards, range, Math.floor(Math.random() * range));
        range--;
    }
};

function swap(array, a ,b){
    var temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}

module.exports = Card;

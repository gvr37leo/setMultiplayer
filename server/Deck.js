var Card = require('./Card');

function Deck(){
    this.cards = this.generateCards();
    this.graveyardPointer = this.cards.length - 1;
    this.handSize = 9;
}

Deck.prototype.getHand = function(){
    return this.cards.slice(0,cap(this.handSize,this.graveyardPointer + 1))
};

Deck.prototype.findSets = function(){
    var hand = this.getHand();
    var sets = [];
    for(var i = 0; i < hand.length - 2; i++){
        for(var j = i + 1; j < hand.length - 1; j++){
            for(var k = j + 1; k < hand.length; k++){
                if(Deck.isSet(hand[i],hand[j],hand[k])){
                    sets.push([i,j,k])
                }
            }
        }
    }
    return sets;
};

Deck.isSet = function(a, b, c){
    for(var i = 0; i < 3; i++){
        if(!((a.attributes[i] == b.attributes[i] && a.attributes[i] == c.attributes[i]) ||
            (a.attributes[i] != b.attributes[i] && a.attributes[i] != c.attributes[i] && b.attributes[i] != c.attributes[i]))){
            return false;
        }
    }
    return true;
};

Deck.prototype.generateCards = function(){
    var cards = [];
    var attributesCount = 3;
    var setSize = 3;

    for(var i = 0; i < Math.pow(attributesCount ,setSize); i++){
        var attributes = convertBase(i,10,attributesCount);
        for(var j = 0; j < setSize; j++)if(attributes[j] == undefined)attributes.unshift(0);
        cards.push(new Card(attributes));
    }
    return cards;
};

Deck.prototype.shuffle = function(){
    var range = this.cards.length - 1;
    while(range >= 0){
        swap(this.cards, range, Math.floor(Math.random() * range));
        range--;
    }
};

function swap(array, a ,b){
    var temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}

function convertBase(n, from, to){
    return toDigits(fromDigits(splitInt(n), from), to)
}

function splitInt(n){
    var digits = [];
    while(n > 0){
        digits.unshift(n % 10);
        n = Math.floor(n / 10);
    }
    return digits;
}

function toDigits(n,base){
    var digits = [];
    while(n > 0){
        digits.unshift(n % base);
        n = Math.floor(n / base);
    }
    return digits;
}

function fromDigits(digits,b){
    var n = 0;
    digits.forEach(function(digit){
        n = b * n + digit;
    });
    return n;
}

function cap(val, cap){
    if(val > cap) return cap;
    return val;
}

Deck.prototype.setAllCardsToUnselected = function(sessionId){
    this.cards.forEach(function(card){
        card.selected[sessionId] = false;
    })
};

Deck.prototype.deleteSelection = function(sessionId){
    this.cards.forEach(function(card){
        delete card.selected[sessionId];
    })
};

module.exports = Deck;
//var setContainer = $('#setContainer');
//var defaultColor = "#000000";
//ctxt.fillStyle = defaultColor;
//ctxt.strokeStyle = defaultColor;
var deck = Card.generateCards();
shuffle(deck);
var handSize = 9;
var graveyardPointer = deck.length - 1;
var selected = [0,0,0];
var selectedSize = 0;
addSetsToSetContainer(Card.findSets(deck.slice(0,handSize)));
update();

function update(){
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    for(var x = 0; x < 3; x++){
        for(var y = 0; y < 3; y++){
            var index = x * Math.pow(3, 1) +  y * Math.pow(3, 0);
            if(index > graveyardPointer) break;
            deck[index].position = new Vector(x * (Card.width + 10) + 10, y * (Card.height + 10) + 10);
            deck[index].draw();
            ctxt.fillText("id: " + (index ), deck[index].position.x + 50, deck[index].position.y + 100);
        }
    }
}

function mouseDown(e){
    var pos = getMousePos(e);
    for(var i = 0; i < handSize && i <= graveyardPointer; i++){
        var card = deck[i];
        if(card.collides(pos)){
            if(card.selected){
                selectedSize--;
                card.selected = !card.selected;
            }else{
                card.selected = !card.selected;
                selected[selectedSize] = i;
                selectedSize++;

                if(selectedSize == 3){
                    if(Card.isSet(deck[selected[0]], deck[selected[1]], deck[selected[2]])){
                        deck[selected[0]] = deck[graveyardPointer];
                        deck[selected[1]] = deck[graveyardPointer - 1];
                        deck[selected[2]] = deck[graveyardPointer - 2];
                        graveyardPointer -= 3;
                        setContainer.empty();
                        addSetsToSetContainer(Card.findSets(deck.slice(0,cap(handSize,graveyardPointer + 1))));
                    }
                    deck[selected[0]].selected = false;
                    deck[selected[1]].selected = false;
                    deck[selected[2]].selected = false;
                    selected = [0,0,0];
                    selectedSize = 0;
                }
            }
            update();
            break;
        }
    }
}

function shuffle(cards){
    var range = cards.length - 1;
    while(range >= 0){
        swap(cards, range, Math.floor(Math.random() * range));
        range--;
    }
}

function swap(array, a ,b){
    var temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}

function getMousePos(e){
    var rect = canvas.getBoundingClientRect();
    return new Vector(e.clientX - rect.left, e.clientY - rect.top);
}

function addSetsToSetContainer(sets){
    sets.forEach(function(aset){
        setContainer.append(aset[0] + "" + aset[1] + "" + aset[2] + ",");
    });
}

function cap(val, cap){
    if(val > cap) return cap;
    return val;
}


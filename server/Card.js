function Card(attributes){
    //a[0] = color,a[1] = shape, a[2] = quantity, a[3] = ?
    this.attributes = attributes;

    this.selected = {};//id's of players that have selected this card
}

module.exports = Card;

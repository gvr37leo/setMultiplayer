function Player(){
    //this.selected = [0,0,0];//maybe map from 0-9 with selected true or false
    this.selected = [false,false,false,false,false,false,false,false,false];
    this.handPointers = [0,0,0];
    this.selectedSize = 0;

    this.score = 0;
}

module.exports = Player;
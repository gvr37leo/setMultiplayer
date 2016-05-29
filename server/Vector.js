function Vector(x,y){
    this.x = x;
    this.y = y;
}

Vector.prototype.midPoint = function(vector, weigth){
    return this.scale(1 - weigth).add(vector.scale(weigth))
};

Vector.prototype.subtract = function(vector){
    var x = this.x - vector.x;
    var y = this.y - vector.y;
    return new Vector(x, y)
};

Vector.prototype.add = function(vector){
    var x = this.x + vector.x;
    var y = this.y + vector.y;
    return new Vector(x, y);
};

Vector.prototype.scale = function(scalar){
    return new Vector(this.x * scalar, this.y * scalar);
};

Vector.distance = function(vector1, vector2){
    var d = vector2.subtract(vector1);
    return Math.pow(Math.pow(d.x,2) + Math.pow(d.y,2), 0.5);
};

module.exports = Vector;
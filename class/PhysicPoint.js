var Point = require('./Point.js');
var Vector = require('./Vector.js');
var CircleVector = require('./CircleVector.js');

class PhysicPoint extends Point {

    constructor(x, y) {
        super(x, y);
        this.velocity = new Vector(0, 0);
        this.friction = new Vector(0.95, 0.95);
        this.bounce = 1;
        this.mass = 1;
        this.radius = 1;
        this.rotation = 0;
        this.circleMovement = new CircleVector(this.rotation, this.radius);
        this.rotateFriction = 0.95;
    }
    update() {
        this.circleMovement.multiply(this.rotateFriction)
        this.velocity.multiply(this.friction);
        this.x = this.round10(this.x + this.velocity.x);
        this.y = this.round10(this.y + this.velocity.y);
    }

}
module.exports = PhysicPoint;
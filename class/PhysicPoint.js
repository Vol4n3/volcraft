var Point = require('./Point.js');
var Vector = require('./Vector.js');
var CircleVector = require('./CircleVector.js');

class PhysicPoint extends Point {

    constructor(x, y) {
        super(x, y);
        this.velocity = new Vector(0, 0);
        this.friction = new Vector(1, 1);
        this.bounce = 1;
        this.mass = 1;
        this.radius = 1;
        this.rotation = 0;
        this.circleMovement = new CircleVector(this.rotation, this.radius);
        //this.circleMovement.speed = 0.2;
        this.rotateFriction = 1;
    }
    update() {
        this.circleMovement.multiply(this.rotateFriction);
        this.rotation = this.circleMovement.angle;

        this.velocity.multiply(this.friction);
        this.x = this.round10(this.x + this.velocity.x);
        this.y = this.round10(this.y + this.velocity.y);
    }
    gravitateTo(p2) {
        var grav = new Vector(0, 0),
            dist = this.distanceTo(p2);

        grav.setLength(p2.mass / (dist * dist));
        grav.setAngle(this.angleTo(p2));
        this.velocity.addTo(grav);
    }

}
module.exports = PhysicPoint;
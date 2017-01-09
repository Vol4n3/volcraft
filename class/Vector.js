var MathPhysics = require('./MathPhysics.js');
var Point = require('./Point.js');
var Segment = require('./Segment.js');

class Vector extends MathPhysics {

    constructor(x, y) {
        super();
        this.type = "Vector";
        this.x = this.round10(x) || 0;
        this.y = this.round10(y) || 0;
        //initialize angle and length
        this.length = 0;
        this.angle = 0;
        //update angle and length
        this.update();
    }
    update() {
        this.getLength();
        this.getAngle();
    }
    setLength(length) {
        this.x = this.round10(Math.cos(this.angle) * length);
        this.y = this.round10(Math.sin(this.angle) * length);
        this.update()
    }
    getLength() {
        this.length = Math.sqrt(this.x * this.x + this.y * this.y);
        return this.length;
    }
    setAngle(angle) {
        this.x = this.round10(Math.cos(angle) * this.length);
        this.y = this.round10(Math.sin(angle) * this.length);
        this.update();
    }
    getAngle() {
        this.angle = Math.atan2(this.y, this.x);
        return this.angle;
    }
    getSegment() {
        var p1 = new Point();
        var p2 = new Point(this.x, this.y);
        return new Segment(p1, p2);
    }
    add(vector) {
        if (vector.type == "Vector") {
            this.x = this.round10(this.x + vector.x);
            this.y = this.round10(this.y + vector.y);
            this.update();
            return this;
        } else {
            return false;
        }
    }

    subtract(vector) {
        if (vector.type == "Vector") {
            this.x = this.round10(this.x - vector.x);
            this.y = this.round10(this.y - vector.y);
            this.update();
            return this;
        } else {
            return false;
        }
    }

    multiply(vector) {
        if (vector.type == "Vector") {
            this.x = this.round10(this.x * vector.x);
            this.y = this.round10(this.y * vector.y);
            this.update();
            return this;
        } else {
            return false;
        }
    }

    divide(vector) {
        if (vector.type == "Vector") {
            this.x = this.round10(this.x / vector.x);
            this.y = this.round10(this.y / vector.y);
            this.update();
            return this;
        } else {
            return false;
        }
    }
}
module.exports = Vector;
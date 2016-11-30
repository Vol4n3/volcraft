var MathPhysics = require('./MathPhysics.js');
class Point extends MathPhysics {

    constructor(x, y) {
        super();
        this.type = "Point";
        this.x = x || 0;
        this.y = y || 0;
    }
    translate(vector) {
        if (vector.type == "Vector") {
            this.x = this.round10(this.x + vector.x);
            this.y = this.round10(this.y + vector.y);
            return this;
        } else {
            return false;
        }
    }
    angleTo(point) {
        if (point.type == "Point") {
            return Math.atan2(point.y - this.y, point.x - this.x);
        } else {
            return false;
        }
    }

    distanceTo(point) {
        if (point.type == "Point") {
            var dx = point.x - this.x,
                dy = point.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);

        } else {
            return false;
        }
    }
}
module.exports = Point;
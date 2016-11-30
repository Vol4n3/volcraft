class MathPhysics {

    constructor() {

    }
    round10(n) {
        var round = Math.round(n * 100) / 100;
        if (round <= 0.1 && round >= -0.1) {
            return 0;
        } else {
            return round;
        }
    }
}
module.exports = MathPhysics;
function sketch(p) {
    function Joueur() {
        this.x = 50;
        this.y = 50;
    }
    var liquid;
    var j = new Joueur();
    //preload
    p.preload = function() {

        }
        //setup
    p.setup = function() {
        p.createCanvas(800, 600);

    };
    //draw
    p.draw = function() {

        p.background(0)
        p.ellipse(j.x, j.y, 55, 55);
    }
    p.mousePressed = function() {

    };
};

var myp5 = new p5(sketch, 'sketch');
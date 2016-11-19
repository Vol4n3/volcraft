var sketch = function(p) {
    var song;
    p.preload = function() {
        song = p.loadSound('/assets/sound/nomoney.mp3');
    }
    p.setup = function() {
        song.loop();
        p.createCanvas(720, 200);
        p.background(255, 100, 0);
        song.pause();

    };
    p.draw = function() {

    }
    p.mousePressed = function() {
        if (song.isPlaying()) { // .isPlaying() returns a boolean
            song.pause();
            p.background(255, 100, 0);
        } else {
            song.play();
            p.background(100, 255, 0);
        }

    };
};

var myp5 = new p5(sketch, 'sketch');
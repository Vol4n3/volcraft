    new p5();
    var jcv_skecth1 = function(s) {

        s.setup = function() {
            var square = createCanvas(480, 360);
            square.parent('sketch1')
        }

        s.draw = function() {
            background(0, 0, 0);
        }
    };

    new p5(jcv_skecth1, 'sketch1');
    new p5();
    var jcv_skecth1 = function(s) {
        var boop = random(100);

        s.setup = function() {
            var square = createCanvas(100, 100);
            square.parent('sketch1')
        }

        s.draw = function() {
            background(255, boop, boop);
        }
        console.log(boop)
    };

    new p5(jcv_skecth1, 'sketch1');
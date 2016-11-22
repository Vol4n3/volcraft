var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'scene', { create: create, update: update, render: render });
var joueur

function create() {
    // Enable Box2D physics
    //game.physics.startSystem(Phaser.Physics.P2JS);
    //game.physics.p2.restitution = 0.9;
    //game.physics.box2d.gravity.y = 500;
    // Static platform 
    joueur = game.add.graphics(50, 50);
    joueur.beginFill(0xFF0000, 1);
    joueur.drawCircle(0, 0, 100);
    //game.physics.p2.enable(joueur);
    game.physics.enable(joueur, Phaser.Physics.ARCADE);
    //platformSprite.body.static = true;

}

function update() {
    //  only move when you click
    if (game.input.mousePointer.isDown) {
        //  400 is the speed it will move towards the mouse
        game.physics.arcade.moveToPointer(joueur, 400);

        //  if it's overlapping the mouse, don't move any more
        if (Phaser.Rectangle.contains(joueur.body, game.input.x, game.input.y)) {
            joueur.body.velocity.setTo(0, 0);
        }
    } else {
        joueur.body.velocity.setTo(0, 0);
    }

}

function render() {

    // game.debug.geom(circle, '#cfffff');

    // game.context.fillStyle = 'rgb(255,255,0)';
    // game.context.fillRect(p1.x, p1.y, 4, 4);

    // game.context.fillStyle = 'rgb(255,0,0)';
    // game.context.fillRect(p2.x, p2.y, 4, 4);

}
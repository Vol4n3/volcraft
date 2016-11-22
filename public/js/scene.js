var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'scene', { preload: preload, create: create, update: update, render: render });
var player

function preload() {
    game.load.spritesheet('ship', '/assets/sprites/humstar.png', 32, 32);
}

function create() {
    // game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.friction = 0.5;
    game.physics.box2d.setBoundsToWorld();
    game.physics.box2d.restitution = 0.7;
    game.physics.box2d.gravity.y = 500;

    ship = game.add.sprite(400, 100, 'ship');
    ship.scale.set(3);
    ship.smoothed = false;
    ship.animations.add('fly', [0, 1, 2, 3, 4, 5], 10, true);
    ship.play('fly');
    game.physics.box2d.enable(ship, false);
    ship.body.setCircle(42);
    //player.body.bounce.y = 0.8;
    //player.body.collideWorldBounds = true;
    game.input.onDown.add(mouseDragStart, this);
    game.input.addMoveCallback(mouseDragMove, this);
    game.input.onUp.add(mouseDragEnd, this);
}

function update() {

    // //  only move when you click
    // if (game.input.mousePointer.isDown) {
    //     //  400 is the speed it will move towards the mouse
    //     game.physics.arcade.moveToPointer(player, 400);

    //     //  if it's overlapping the mouse, don't move any more
    //     if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)) {
    //         player.body.velocity.setTo(0, 0);
    //     }
    // }

}

function mouseDragStart() {

    game.physics.box2d.mouseDragStart(game.input.mousePointer);

}

function mouseDragMove() {

    game.physics.box2d.mouseDragMove(game.input.mousePointer);

}

function mouseDragEnd() {

    game.physics.box2d.mouseDragEnd();

}

function render() {

    // game.debug.geom(circle, '#cfffff');

    // game.context.fillStyle = 'rgb(255,255,0)';
    // game.context.fillRect(p1.x, p1.y, 4, 4);

    // game.context.fillStyle = 'rgb(255,0,0)';
    // game.context.fillRect(p2.x, p2.y, 4, 4);

}
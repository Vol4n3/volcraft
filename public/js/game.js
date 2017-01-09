(function() {
    var scene = document.getElementById('scene');
    var canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    var ctx = canvas.getContext('2d');
    scene.appendChild(canvas);
    var point;
    socket.on('draw', function(data) {
        point = data;
        //console.log(data.rotation)
    });
    var p1 = new jc_physics.PhysicPoint(10, 10)
    var p2 = new jc_physics.PhysicPoint(10, 100);
    var p5 = new jc_physics.PhysicPoint(50, 50);
    var p3 = new jc_physics.PhysicPoint(100, 100);
    var p4 = new jc_physics.PhysicPoint(100, 10);
    //p2.velocity.y = 1;
    //p1.velocity.x = 0.5;
    var pol1 = new jc_physics.Polygone(p1, p2, p5, p3, p4);

    var world = new jc_physics.World(pol1);


    var animate = function() {
        ctx.clearRect(0, 0, 800, 600);
        world.draw(ctx);

        //pol1.draw(ctx);
        requestAnimationFrame(animate);
    };
    animate();
})()
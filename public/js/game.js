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
        console.log(data)
    });
    var animate = function() {
        if (point) {
            ctx.clearRect(0, 0, 800, 600);
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(animate);
    };
    animate();
})()
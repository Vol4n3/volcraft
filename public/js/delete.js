$(function() {
    var socket = io();
    var $canvas = $("canvas");
    var ctx = $canvas[0].getContext("2d");
    var centerX = $canvas.width() / 2;
    var centerY = $canvas.height() / 2;
    //Mettre les Coordonnées de la map 
    var playerX;
    var playerY;
    // Detection de la souris
    var mouseAngle;
    var angleOuv = 0.87;
    var click = false;
    var vecteurX;
    var vecteurY;
    // Position des autres entities
    var OtherEntities = function(posX, posY, light, mouseA) {
        this.posX = posX;
        this.posY = posY;
        this.light = light;
        this.mouseA = mouseA
    }
    var personnageLumiere = function(mouseAngle, angleOuv) {
        var angle = mouseAngle;
        var aMin = Math.PI * (angle + angleOuv);
        var aMax = Math.PI * (angle - angleOuv);
        var grd = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 500);
        grd.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        grd.addColorStop(1, "rgba(0, 0, 0, 0.0)");
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, 500, aMin, aMax); //largeur de faisceau 
        ctx.moveTo(centerX, centerY);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
        ctx.fill();
    }
    var otherPosition = function(posX, posY, light, mouseA) {
        //Exemple entity

        if (light) {
            var angle = mouseA;
            var aMin = Math.PI * (angle + angleOuv);
            var aMax = Math.PI * (angle - angleOuv);
            var grd = ctx.createRadialGradient(centerX + posX, centerY + posY, 0, centerX + posX, centerY + posY, 500);
            grd.addColorStop(0, "rgba(255, 255, 255, 0.8)");
            grd.addColorStop(1, "rgba(0, 0, 0, 0.0)");
            ctx.beginPath();
            ctx.fillStyle = grd;
            ctx.moveTo(centerX + posX, centerY + posY);
            ctx.arc(centerX + posX, centerY + posY, 500, aMin, aMax); //largeur de faisceau 
            ctx.moveTo(centerX + posX, centerY + posY);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "rgb(200, 200, 200)";
        } else {
            ctx.beginPath();
            ctx.fillStyle = "rgb(0, 0, 0)";
        }
        ctx.arc(centerX + posX, centerY + posY, 10, 0, Math.PI * 2)
        ctx.fill();
        /* ESSAI OMBRE
        ctx.beginPath();
        ctx.moveTo(centerX + 20,centerY + 20);
        ctx.arc(centerX + 20,centerY + 20,50,aMin,aMax);
        ctx.moveTo(centerX + 20,centerY + 20);
        ctx.fill();
        */
    }

    //Event Souris
    $("canvas").mousemove(function(e) {
        var mouseX = e.offsetX - centerX;
        var mouseY = e.offsetY - centerY;
        mouseAngle = (Math.atan2(mouseY, mouseX) / Math.PI) + 1;
        //Calcul des angles Vectoriels
        vecteurX = Math.atan2(mouseY, mouseX);
        vecteurY = Math.atan2(mouseX, mouseY);

        // Angles D'ouverture

    }).mousedown(function() {
        click = true;
        socket.emit('light');

    }).mouseup(function() {
        click = false;
        socket.emit('off');
    }).mouseleave(function() {
        click = false;
        socket.emit('off');
    });
    var enemiesPosition = {};
    // Position du joueur envoyé par le serveur
    socket.on('position joueur', function(data) {
        playerX = data.posX;
        playerY = data.posY;
    });
    // Position des autres Joueurs par le serveur
    socket.on('position adversaire', function(data) {

        if (enemiesPosition.hasOwnProperty(data.id)) {
            enemiesPosition[data.id].info.posX = data.posX;
            enemiesPosition[data.id].info.posY = data.posY;
            enemiesPosition[data.id].info.light = data.light;
            enemiesPosition[data.id].info.mouseA = data.mouseA;
        } else {
            var e = new OtherEntities(data.posX, data.posY, data.light, data.mouseA);
            enemiesPosition[data.id] = {
                info: e
            }

        }
    });
    //PLAYER CONTROL
    var playerUp = false;
    var playerDown = false;
    var playerLeft = false;
    var playerRight = false;
    var playerFire = false;
    $("html").keydown(function(e) {
        switch (e.keyCode) {
            case 90: //key Z
                playerUp = true;
                break;
            case 83: // key S
                playerDown = true;
                break;
            case 81: // key Q
                playerLeft = true;
                break;
            case 68: // key D
                playerRight = true;
                break;
            case 32: // key space

                // Emit 1 shoot Fire On key pressing
                if (playerFire == false) {
                    socket.emit('fire', {
                        posX: playerX,
                        posY: playerY,
                        vecX: vecteurX,
                        vecY: vecteurY
                    });
                    var grd = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
                    grd.addColorStop(0, "rgba(255,0,0,0.04)");
                    grd.addColorStop(1, "rgba(0,0,0,0.00)");
                    ctx.beginPath();
                    ctx.fillStyle = grd;
                    ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
                    ctx.fill();
                }

                playerFire = true;

                break;
        }
        //console.log(e.keyCode);
    }).keyup(function(e) {
        switch (e.keyCode) {
            case 90: //key Z
                playerUp = false;
                break;
            case 83: // key S
                playerDown = false;
                break;
            case 81: // key Q
                playerLeft = false;
                break;
            case 68: // key D
                playerRight = false;
                break;
            case 32: // key space
                playerFire = false;
                break;
        }
    });
    //Position des bullets
    socket.on('bullet', function(data) {
        var bulletPosX = centerX + playerX - data.posX;
        var bulletPosY = centerY + playerY - data.posY
        ctx.beginPath();
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.arc(bulletPosX, bulletPosY, 3, 0, Math.PI * 2)
        ctx.fill();
        //Aura de feu autour de la balle    
        var grd = ctx.createRadialGradient(bulletPosX, bulletPosY, 0, bulletPosX, bulletPosY, 100);
        grd.addColorStop(0, "rgba(255,0,0,0.04)");
        grd.addColorStop(1, "rgba(0,0,0,0.00)");
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(bulletPosX, bulletPosY, 100, 0, Math.PI * 2)
        ctx.fill();
    });

    // lancement de l'animation
    var deaths = 0;
    var kills = 0;
    socket.on('death', function() {
        deaths++;
    });
    socket.on('kill', function() {
        kills++;
    })
    var animateCanvas = function() {
        ctx.fillStyle = "rgba(0,0,0, 0.50)";
        ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
        ctx.font = "12px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.fillText("x =" + playerX + ", y=" + playerY + "", 10, 60);
        ctx.fillText("deaths =" + deaths + ", kills=" + kills + "", 400, 60);
        if (click) {
            personnageLumiere(mouseAngle, angleOuv);

        } else {
            ctx.beginPath();
            ctx.fillStyle = "rgba(60, 60, 60, 0.5)";
            ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
            ctx.fill();

        }

        for (var prop in enemiesPosition) {
            otherPosition(playerX - enemiesPosition[prop].info.posX, playerY - enemiesPosition[prop].info.posY, enemiesPosition[prop].info.light, enemiesPosition[prop].info.mouseA);
            //console.log(enemiesPosition[prop]);
        }

        //otherPosition(playerX + 20,playerY + 20);
        //otherPosition(playerX + 30,playerY + -20);
    }
    var listenerControls = function() {
        //Gestion des Positions et Controles à mettre coté serveur
        if (playerUp) {
            socket.emit('up');
        }
        if (playerDown) {
            socket.emit('down');
        }
        if (playerLeft) {
            socket.emit('left');
        }
        if (playerRight) {
            socket.emit('right');
        }
        //envoi de l'orientation si click
        if (click) {
            socket.emit('orientation', {
                mouseA: mouseAngle
            });
        }
    }

    //Vitesse De la boucle
    setInterval(animateCanvas, 35);
    //Ecoute Controle
    setInterval(listenerControls, 35);
});
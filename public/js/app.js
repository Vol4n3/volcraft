(function() {
    "use strict";
    var logged = false;
    $('.jq-hide').hide();
    //================ Global Function
    //Message create
    var Message = function(data) {
        this.msg = data.message || "";
        this.pseudo = data.pseudo || "anonymous";
        this.date = data.date || Date.now();
        this.rank = data.rank || "anonymous";
        this.msgClass = data.msgClass || "chat_message";
        this.toHtml();
        this.appendTo(document.getElementById('chat_textes'))
    }
    Message.prototype.toHtml = function() {
        this.cm = document.createElement('div');
        this.cm.className = this.msgClass;
        var cp = document.createElement('span');
        cp.className = this.rank + " chat_pseudo";
        cp.setAttribute('chat_pseudo', this.pseudo);
        cp.innerText = this.pseudo;
        var cs = document.createElement('span');
        cs.className = "chat_say";
        cs.innerText = this.msg;
        this.cm.appendChild(cp);
        this.cm.appendChild(cs);
    }
    Message.prototype.appendTo = function(parent) {
        parent.appendChild(this.cm);
    }

    //==============Event client 
    //send message
    document.getElementById('chat_edit').addEventListener('keydown', function(e) {

        if (e.keyCode == 13) {
            e.preventDefault();
            if (logged == true) {
                socket.emit("message",
                    e.target.textContent
                );
                e.target.textContent = "";
            } else {
                $('#login_modal').modal('show');
            }
        }
    });
    //Login block
    document.getElementById('auth_log').addEventListener('submit', function(e) {
        e.preventDefault();
        socket.emit('login', {
            pseudo: this['pseudo'].value,
            password: this['password'].value
        })
    });
    document.getElementById('logout_btn').addEventListener('click', function(e) {
        socket.emit('logout');
    })

    //===============Event socket 
    socket.on('globalMessage', function(data) {
        new Message(data);
    });
    socket.on('err', function(data) {
        if (data == "User not found !") {
            $('#warning_pseudo').fadeIn('slow');
        }
    });
    socket.on('succes', function(data) {
        if (data.type == "login") {
            logged = true;
            $('#login_modal').modal('hide');
            $('#login_btn').fadeOut('slow');
            $('#logout_btn').fadeIn('slow');
        }
    });
    socket.on('logout', function() {
        logged = false;
        $('#logout_btn').fadeOut('slow');
        $('#login_btn').fadeIn('slow');
    });
    socket.on('redirect', function(data) {
        window.location.href = data;
    });

})()
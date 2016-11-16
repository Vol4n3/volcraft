(function() {
    var $ = jQuery;
    //Chat app
    var socket = io.connect('http://localhost:8081');
    var editText = document.getElementById('chat_edit');
    var formLog = document.getElementById('auth_log');
    //Message create
    var Message = function(msg) {
        this.msg = msg;
        this.pseudo = "Vol4n3";
        this.date = new Date;
        this.rank = "default";
        this.toHtml();
        this.appendTo(document.getElementById('chat_textes'))

    }
    Message.prototype.toHtml = function() {
        this.cm = document.createElement('div');
        this.cm.className = "chat_message";
        var cp = document.createElement('span');
        cp.className = "chat_pseudo " + this.rank;
        cp.textContent = this.pseudo;
        var cs = document.createElement('span');
        cs.className = "chat_say";
        cs.textContent = this.msg;
        this.cm.appendChild(cp);
        this.cm.appendChild(cs);
    }
    Message.prototype.appendTo = function(parent) {
        parent.appendChild(this.cm);
    }

    //Event manager
    //send message
    editText.addEventListener('keydown', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            socket.emit("message", e.target.textContent);
            e.target.textContent = "";
        }
    });
    //Login block
    formLog.addEventListener('submit', function(e) {
        e.preventDefault();
        socket.emit('register', {
            pseudo: this['pseudo'].value,
            password: this['password'].value
        })
    })
    socket.on('globalMessage', function(data) {
        new Message(data);
    });
    socket.on('err', function(data) {
        console.log(data);
    });
    socket.on('succes', function(data) {
        if (data.type == "login") {
            $('#chat_auth').slideUp('fast', function() {
                $('.chat_edit').fadeIn('fast');
                $('.chat_btns').fadeIn('fast');
            });
        }
    });
})()
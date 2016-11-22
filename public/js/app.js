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
        //content global message
        this.cm = document.createElement('div');
        this.cm.className = this.msgClass;
        //content pseudo
        var cp = document.createElement('span');
        cp.className = this.rank + " chat_pseudo";
        cp.setAttribute('chat_pseudo', this.pseudo);
        cp.innerText = this.pseudo;
        //content say
        var cs = document.createElement('span');
        cs.className = "chat_say";
        cs.innerText = this.msg;
        this.cm.appendChild(cp);
        this.cm.appendChild(cs);
    }
    Message.prototype.appendTo = function(parent) {
        parent.appendChild(this.cm);
        parent.scrollTop = parent.scrollHeight;
    }


    var OnlineMember = function(data) {
        this.pseudo = data.pseudo || "anonymous";
        this.rank = data.rank || "anonymous";
        this.toHtml();
    }
    OnlineMember.prototype.toHtml = function() {
        this.cm = document.createElement('div');
        this.cm.innerText = this.pseudo;
        this.cm.className = this.rank;
        this.cm.setAttribute('chat_pseudo', this.pseudo);
    }
    OnlineMember.prototype.appendTo = function(parent) {
            parent.appendChild(this.cm);
        }
        //Liste of online member
    function list_Online_Member(list) {
        $('#chat_onlines').children().remove();
        for (var i in list) {
            var OM = new OnlineMember(list[i]);
            $('#chat_onlines').append($(OM.cm));
        }
    };
    var old_msg = [];
    var index_old_msg = 0;
    //send message

    function sendMessage(e) {
        if (logged == true) {
            socket.emit("message",
                $('#chat_edit').text()
            );
            //push in array
            old_msg.push($('#chat_edit').text());
            //get last key
            index_old_msg = old_msg.length;
            //clear the text
            $('#chat_edit').text(" ");
        } else {
            //if not logged show modal
            $('#login_modal').modal('show');
        }
    }
    //==============Event client 
    $('#chat_edit').keydown(function(e) {
        // client press enter on text edit
        if (e.keyCode == 13) {
            e.preventDefault();
            sendMessage(e);
        }
        //press up to find last messages written
        else if (e.keyCode == 38) {
            index_old_msg--;
            if (index_old_msg < 0) {
                index_old_msg = 0;
            }
            console.log(index_old_msg)
            $('#chat_edit').text(old_msg[index_old_msg]);
        }
        //press down to find last messages written
        else if (e.keyCode == 40) {
            index_old_msg++;
            if (index_old_msg > old_msg.length - 1) {
                index_old_msg = old_msg.length - 1;
            }
            $('#chat_edit').text(old_msg[index_old_msg]);
        }
    });
    // client click send on text edit
    $('#chat_send').click(function(e) {
        sendMessage();
    });
    //client submit form to login
    $('#auth_log').submit(function(e) {
        e.preventDefault();
        socket.emit('login', {
            pseudo: this['pseudo'].value,
            password: this['password'].value
        })
    });
    // client logout
    $('#logout_btn').click(function(e) {
        socket.emit('logout');
    });
    // client click on pseudo to whisp him
    $('#chat_box').click(function(e) {
        var pseudo = $(e.target).attr('chat_pseudo')
        if (pseudo) {
            $('#chat_edit').html('@' + pseudo + '&nbsp;' + $('#chat_edit').text());
        }
    });
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
    socket.on('update_online', function(data) {
        list_Online_Member(data);
    })
})()
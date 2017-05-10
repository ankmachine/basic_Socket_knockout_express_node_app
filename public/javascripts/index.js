var socket = io.connect('http://192.168.1.76:4200');
socket.on('connect', function (data) {
    socket.emit('join', 'Hello World from client');
});

// socket.on('broad', function (data) {
//     $('#future').append(data + "<br/>");
// });
// $('form').submit(function (e) {
//     e.preventDefault();
//     var message = $('#chat_input').val();
//     socket.emit('messages', message);
// });


function AppViewModel() {
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");
    this.chatList = ko.observableArray([]);
    this.chatBody = ko.observable('');
    this.username = '';

    this.enterChat = function () {
        var bodyData = { "username": this.username };
        // console.log(bodyData);
        $.ajax({
            url: "http://localhost:4200/callsign",
            mimeType: "application/json",
            dataType: "json",
            type: "POST",
            data: bodyData
        })
    };

    this.addBroadChat = function (data) {
        var chatData = data.user+": "+data.msg;
        this.chatList.push(chatData);
    }

    this.submit = function () {

        // alert(this.chatBody());
        this.chatList.push(this.chatBody());
        var message = this.chatBody();
        socket.emit('messages', {"msg":message, "user":this.username});      // Read the current value
        this.chatBody('');
    };
}

// Activates knockout.js
var appModel = new AppViewModel();
ko.applyBindings(appModel);

socket.on('broad', function (data) {
    // alert(data);
    appModel.addBroadChat(data);
});
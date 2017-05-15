var socket = io.connect('http://192.168.1.76:4200');
socket.on('connect', function (data) {
    socket.emit('join', 'Hello World from client');
    var roomlist = ["bunny", "cat", "horse", "lion"];
    // alert(roomlist);
    for(room of roomlist){
        socket.emit('subscribe', room);
    }
    
});



function AppViewModel() {
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");
    this.notificationList = ko.observableArray([]);
    this.chatList = ko.observableArray([]);
    this.chatBody = ko.observable('');
    this.username = ko.observable('');
    this.usernameSet = ko.observable(false);
    this.roomList = ko.observableArray(["bunny", "cat", "horse", "lion", "peacock"])
    this.selectedRoom = ko.observable('');
    this.subscribedRoomList = ko.observableArray(["bunny", "cat", "horse", "lion"])

    this.enterChat = function () {
        var bodyData = { "username": this.username };

        $.ajax({
            url: "http://localhost:4200/callsign",
            mimeType: "application/json",
            dataType: "json",
            type: "POST",
            data: bodyData
        }).then(this.usernameSet(true));
    };

    this.addBroadChat = function (data) {
        var notificationData = data.user+" sent "+data.msg+" in room "+data.roomId;
        this.notificationList.push(notificationData);
        if(this.selectedRoom()==data.roomId){
            var chatData = data.user+": "+data.msg;
            this.chatList.push(chatData);
        }
    }

    this.submit = function () {

        this.chatList.push(this.chatBody());
        var message = this.chatBody();
        socket.emit('messages', {"msg":message, "user":this.username(), "roomId":this.selectedRoom()});      // Read the current value
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
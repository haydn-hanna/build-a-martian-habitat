const express = require('express');
const app = express();
var feedback_queue = [];
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var teacher = "";

var sockets = {}

/* Set up express app */
app.use(express.static("public"));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
server.listen(process.env.PORT, () => {
    console.log('listening on *:5000');
});

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    sockets[socket.id] = socket;
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        delete sockets[socket.id]
    });
    socket.on('feedback-request', (data) => {
        console.log("I received a feedback request.")
        data.id = socket.id;
        handleFeedbackRequest(data);
    })
    socket.on('teacher-connected', (msg) => {
        console.log(`A teacher has connected.`)
        teacher = socket.id;
        io.to(teacher).emit('teacher-connected', feedback_queue);
    })
    socket.on('feedback', (feedback) => {
        console.log(`I received teacher feedback.`)
        io.to(feedback.id).emit('feedback', feedback);
    })
})

function handleFeedbackRequest(data) {
    if (teacher != "") {
        io.to(teacher).emit('feedback-request', data);
        console.log("I sent the feedback request to the teacher.")
    } else {
        feedback_queue.push(data);
    }
}
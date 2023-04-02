const express = require('express');
const app = express();
var feedback_queue = [];
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env['open_ai_api_key']
});

console.log(process.env['open_ai_api_key'])
const openai = new OpenAIApi(configuration);

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
        console.log(`A student is requestion feedback: ${data}`)
        data.id = socket.id;
        handleFeedbackRequest(data);
    })
    socket.on('teacher-connected', (msg) => {
        console.log(`A teacher has connected.`)
        teacher = socket.id;
        io.to(teacher).emit('teacher-connected', feedback_queue);
    })
    socket.on('feedback', (feedback) => {
        console.log(`A teacher has delivered feedback: ${feedback}`)
        io.to(feedback.id).emit('feedback', feedback);
    })
})

async function handleFeedbackRequest(data) {
    var gpt_prompt = `Below is a question and the answer to that question. The question is part of a quiz that teachers 8-12 year old children about designing websites. Could you give this student some feedback so that the teacher doesn't need to? Write it as if you were the child's teacher. Keep it short! Student name: ${data.student_name} Question: ${data.question} Answer: ${data.answer}.`
  
    const potential_feedback = await promptGPTTurbo(gpt_prompt)
    data.potential_feedback = potential_feedback
    if (teacher != "") {
        io.to(teacher).emit('feedback-request', data);
        console.log("Feedback request sent to the teacher.")
    } else {
        feedback_queue.push(data);
    }
}

async function promptGPTTurbo(prompt){
  try{
    const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: prompt}],
  });
    return completion.data.choices[0].message.content
  }catch(e){
    return "ChatGPT experienced an error. Sorry, you're on your own for this one."
  }
}
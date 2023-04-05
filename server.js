const express = require('express');
const app = express();

const feedbackQueue = [];
const sockets = {};

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { Configuration, OpenAIApi } = require("openai");
const openaiConfiguration = new Configuration({
  apiKey: process.env['open_ai_api_key']
});
const openai = new OpenAIApi(openaiConfiguration);

let teacherSocketId = "";

/* Set up express app */
app.use(express.static("public"));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT, () => {
  console.log('listening on *:5000');
});

/* Set up socket.io */
io.on('connection', (socket) => {

  console.log(`${socket.id} connected`);

  sockets[socket.id] = socket;

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    delete sockets[socket.id];
  });

  socket.on('feedback-request', (data) => {
    console.log(`A student has requested feedback: ${data}`);
    data.socketId = socket.id;
    handleFeedbackRequest(data);
  });

  socket.on('teacher-connected', (msg) => {
    console.log(`A teacher has connected.`);
    teacherSocketId = socket.id;
    io.to(teacherSocketId).emit('teacher-connected', feedbackQueue);
  });

  socket.on('feedback', (feedback) => {
    console.log(`A teacher has delivered feedback: ${feedback}`);
    io.to(feedback.socketId).emit('feedback', feedback);
  });

});

/**
 * Handle a feedback request by generating feedback using OpenAI's GPT-3.5 API and sending it to the teacher or queuing it for later.
 * @param {Object} data - The data associated with the feedback request.
 * @param {string} data.studentName - The name of the student requesting feedback.
 * @param {string} data.question - The question the student is seeking feedback on.
 * @param {string} data.answer - The answer the student provided for the given question.
 */
async function handleFeedbackRequest(data) {

  const gptPrompt = `Below is a question and the answer to that question. The question is part of a quiz that teaches 8-12 year old children about designing websites. Could you give this student some feedback so that the teacher doesn't need to? Write it as if you were the child's teacher. Keep it short! Student name: ${data.studentName} Question: ${data.question} Answer: ${data.answer}.`;

  const potentialFeedback = await getGPTCompletion(gptPrompt);

  data.potentialFeedback = potentialFeedback;

  if (teacherSocketId !== "") {
    io.to(teacherSocketId).emit('feedback-request', data);
    console.log("Feedback request sent to the teacher.");
  } else {
    feedbackQueue.push(data);
  }

}

/**
 * Use OpenAI's GPT-3.5 API to generate text based on a given prompt.
 * @param {string} prompt - The prompt for the GPT-3.5 API to generate text from.
 */
async function getGPTCompletion(prompt){

  try{
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}]
    });

    return completion.data.choices[0].message.content;

  } catch (e) {
    return "ChatGPT experienced an error. Sorry, you're on your own for this one.";
  }

}
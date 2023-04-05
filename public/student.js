const socket = io();

let awaiting_feedback = false;

socket.on('feedback', function(feedback) {
  awaiting_feedback = false;
  document.querySelector('#potential-feedback').innerText = feedback.feedback;
});

document.querySelector('#feedback-form').addEventListener('submit', function(event) {
  event.preventDefault();

  if (awaiting_feedback) {
    alert("You can't request more feedback until your previous request has been responded to!");
    return;
  }
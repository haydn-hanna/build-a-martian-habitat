const socket = io();

socket.emit('teacher-connected');

socket.on('feedback-request', (data) => {

  const currentFeedback = document.createElement('div');
  currentFeedback.classList.add('potential-feedback');
  currentFeedback.innerHTML = `
    <h3>${data.studentName}: ${data.question}</h3>
    <p>${data.answer}</p>
    <button class="btn btn-primary give-feedback" data-socketid=${data.socketId}>Give feedback</button>
  `;

  const feedbackRequestsContainer = document.querySelector('#feedback-requests-container');
  feedbackRequestsContainer.appendChild(currentFeedback);

  let giveFeedbackButtons = document.querySelectorAll('.give-feedback');

  giveFeedbackButtons.forEach(button => {
    button.onclick = function() {
      giveFeedback(this.dataset.socketid, data.studentName, data.question, data.answer);
    }
  });

});

socket.on('teacher-connected', (queueData) => {

  if (queueData.length === 0) {
    const feedbackRequestsContainer = document.querySelector('#feedback-requests-container');
    feedbackRequestsContainer.outerHTML = '<h3>No feedback requests at the moment</h3>';
  } else {
    queueData.forEach((data) => {
      const currentFeedback = document.createElement('div');
      currentFeedback.classList.add('potential-feedback');
      currentFeedback.innerHTML = `
      <h3>${data.studentName}: ${data.question}</h3>
      <p>${data.answer}</p>
      <button class="btn btn-primary give-feedback" data-socketid=${data.socketId}>Give feedback</button>
      `;

      const feedbackRequestsContainer = document.querySelector('#feedback-requests-container');
      feedbackRequestsContainer.appendChild(currentFeedback);

      let giveFeedbackButtons = document.querySelectorAll('.give-feedback');

      giveFeedbackButtons.forEach(button => {
        button.onclick = function() {
          giveFeedback(this.dataset.socketid, data.studentName, data.question, data.answer);
        }
      });
    });
  }
});

function giveFeedback(socketId, studentName, question, answer) {
  const potentialFeedback = prompt(`What feedback would you like to give to ${studentName} for their answer to the question "${question}"? \n\n${answer}`);

  const data = {
    "socketId": socketId,
    "feedback": potentialFeedback
  }

  socket.emit('feedback', data);

  const feedbackRequestsContainer = document.querySelector('#feedback-requests-container');
  const buttonToDisable = feedbackRequestsContainer.querySelector(`[data-socketid='${socketId}']`);
  buttonToDisable.outerHTML = '<p>Feedback given! Reload the page to see more feedback requests.</p>';
}
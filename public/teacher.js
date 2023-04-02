/**
 *Creates a new feedback request card for the teacher. 
 *
 * @param {object} An object containing the student's name, the question, and their answer.
 */
function createFeedbackCard(feedback_request) {
    console.log(feedback_request)
    var student_name = feedback_request.student_name
    var question = feedback_request.question
    var answer = feedback_request.answer
    var feedback_request_id = feedback_request.id
    var potential_feedback = feedback_request.potential_feedback
  
    var feedback_container = document.getElementById('feedback-container');

    var feedback_card = document.createElement('div')
    feedback_card.classList.add("w3-card-4");
    feedback_card.classList.add("flex-item");
    feedback_card.id = feedback_request.id;

    var header = document.createElement('header')
    header.classList.add("w3-container");
    header.innerHTML = `<h1>${student_name}</h1>`;

    var body = document.createElement('div')
    var feedback_textarea_id = `feedback_${feedback_request_id}`
    body.classList.add('w3-container')
    body.innerHTML = `
      <p><b>Question: </b>${question}</p>
      <p><b>Answer: </b>${answer}</p>
      <textarea id="${feedback_textarea_id}">${potential_feedback}</textarea>
      `
  
    var footer = document.createElement('footer')
    footer.classList.add('w3-container');
    footer.classList.add('flex-container');
    footer.classList.add('flex-direction-row');

    footer.innerHTML = `<button class="btn card-btn btn-success" onclick="sendFeedbackToServer(true,'${feedback_request_id}')" id="approved">Approve</button><button class="btn card-btn btn-danger" onclick="sendFeedbackToServer(false,'${feedback_request_id}')"id="Denied">Deny</button>`

    feedback_card.appendChild(header);
    feedback_card.appendChild(body);
    feedback_card.appendChild(footer);

    feedback_container.appendChild(feedback_card);
}
/**
 * Loops through the feedback queue and creates feedback cards for each feedback request
 *
 * @param {array} An array of feedback requests stored in the event the teacher is not connected
 */
function handleFeedbackQueue(feedback_queue) {
    for (var feedback in feedback_queue) {
        var currentFeedback = feedback_queue[feedback];
        createFeedbackCard(currentFeedback);
    }
}
/**
 * Handles an incoming feedback request from a student.
 *
 * @param {object} feedback_request: an object that contains the student's name, the question and their given answer.
 */
function handleFeedbackRequest(feedback_request) {
    console.log(`A student has requested feedback: ${feedback_request}`)
    createFeedbackCard(feedback_request);
}
/**
 * Sends feedback to the server so that it can be delivered to the student
 *
 * @param {boolean} approved: whether the answer was approved or dissaproved
 * @param {string} dest_socket_id: the socket id where the server should send the feedback
 */
function sendFeedbackToServer(approved, dest_socket_id) {
    var feedback = {
        approved: approved,
        id: dest_socket_id,
        feedback: document.getElementById(`feedback_${dest_socket_id}`).innerHTML
    }
    document.getElementById(`${feedback.id}`).remove();
    socket.emit('feedback', feedback);
    console.log(`Sent feedback to the server: ${feedback}`)
}
/**
 * Navigates from the teacher dashboard back to the home screen
 *
 */
function showHomeScreen() {
    teacher_dashboard.style.display = 'none';
    home_screen.style.display = 'flex';
}




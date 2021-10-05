/**
 *Picks a random question and displays it in the question modal
 *
 */
function openQuestion() {
    question_modal.style.display = "block";

    var questionNumber = Math.floor(Math.random() * (questions.length - 0));
    //var questionNumber = questions.length - 1; //for testing
    var currQuestionObj = questions[questionNumber];

    question_area.innerHTML = currQuestionObj.question;

    var answers = currQuestionObj.answers;
    answer_area.innerHTML = '';

    if (answers == 'short-answer') {
        answer_area.innerHTML += "<textarea id='answer_area' rows='4'></textarea>"
        answer_area.innerHTML += `<button class='btn btn-warning quiz-answer' id='submit' data-type='manual-mark' onclick='checkAnswer(this)'>Submit</button>`
    } else {
        for (var answer in answers) {
            var currAnswer = answers[answer];
            answer_area.innerHTML += `<button class='btn btn-warning quiz-answer' onclick='checkAnswer(this)' data-correct="${currAnswer.correct}" data-feedback="${currAnswer.feedback}">${currAnswer.text}</button>`
        }
    }
    feedback_area.innerHTML = 'You can do it!'
    questions.splice(questionNumber, 1);

}
/**
 * Shows the specified modal.
 *
 * @param {string} modalName: The id of the modal to show
 */
function openModal(modalName) {
    document.getElementById(modalName).style.display = "block"
}
/**
 * Shows the picture with the correct number of habitat pieces.
 *
 * @param {int} number: how many habitat pieces should be shown
 */
function showPicture(number) {
    var img_src = `images/habitat-${number}.png`
    img.setAttribute('src', img_src)
    closeModal('questionModal')

    if (score == 5) {
        openModal('certificate_modal')
    }
}
/**
 * Checks whether the button pressed was the correct answer, or sends the answer to the server for feedback
 *
 * @param {HTML element} elmt: The answer button that triggered the event
 */
function checkAnswer(elmt) {
    feedback_box.innerHTML = '';

    var question_type = elmt.getAttribute('data-type');

    //if the question doesn't require teacher approval, update the feedback box for the student and show the 'print' button
    //else send the answer to the server for feedback
    if (question_type != 'manual-mark') {
        var feedback = elmt.getAttribute("data-feedback");
        var correct = elmt.getAttribute('data-correct');
        switch (correct) {
            case 'correct':
                feedback_box.innerHTML += 'That\'s correct! ';
                elmt.style.background = 'green';
                score++;
                feedback_box.innerHTML += feedback;
                showCloseBtn();
                break;
            case 'correct-1':
            case 'correct-2':
                if (allCorrect == 0) {
                    allCorrect = 1;
                    elmt.style.background = 'green';
                    feedback_box.innerHTML += feedback;
                } else if (allCorrect == 1) {
                    allCorrect = 0;
                    score++;
                    feedback_box.innerHTML += feedback;
                    elmt.style.background = 'green';
                    showCloseBtn();
                }
                break;
            case 'incorrect':
                feedback_box.innerHTML += 'Sorry that is incorrect. '
                feedback_box.innerHTML += feedback;
                elmt.style.background = 'red';
                break;
        }
        elmt.disabled=true;
    } else {
        var answer = document.getElementById('answer_area').value;
        sendFeedbackRequestToServer(name, question_area.innerHTML, answer)
    }

}
/**
 * Closes the specified modal
 *
 * @param {*} modalName: the id of the modal to close
 */
function closeModal(modalName) {
    document.getElementById(modalName).style.display = "none"
}
/**
 * Handles the feedback from the teacher. If the teacher approves, updates the score and shows print button, else requests that the student resubmit
 *
 * @param {object} feedback: the feedback object from the server
 */
function handleFeedback(feedback) {
    awaiting_feedback = false;
    var approved = feedback.approved;

    if (approved) {
        score++;
        answer_area.innerHTML = 'Well done! The teacher approved your answer!'
        feedback_box.innerHTML = ""
        showCloseBtn();
    }else{
        feedback_box.innerHTML='Sorry, your teacher would like you to retry this answer!'
        var submit_button = document.getElementById('submit')
        console.log(submit_button.innerHTML)
        submit_button.disabled=false;
    }
}
/**
 * Requests the server ask the teacher for feedback on the given answer
 *
 * @param {string} student_name: the name of the student requesting feedback
 * @param {string} question: the question text
 * @param {string} answer: the given answer
 */
function sendFeedbackRequestToServer(student_name, question, answer) {
    var feedback_request = {
        student_name: student_name,
        question: question,
        answer: answer
    }
    socket.emit('feedback-request', feedback_request);
    document.getElementById('submit').setAttribute('disabled', 'true')
    awaiting_feedback = true;
    showAwaitingFeedbackMessage();
    console.log('I sent a feedback request.')
}
/**
 *Shows an awaiting feedback message to the student while their answer is awaiting approval from the teacher
 *
 */
function showAwaitingFeedbackMessage() {
    feedback_area.innerHTML = 'The teacher is looking at your answer! Please wait'
}
/**
 * Shows the print button
 *
 */
function showCloseBtn() {
    feedback_box.innerHTML += '<br>Press the print button below to add a new section to your habitat!'
    feedback_box.innerHTML += `<div><button class="btn btn-warning" onClick="showPicture(${score})">Print!</button></div>`
}

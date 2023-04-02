var allCorrect = 0;
var name="";
const socket = io();
var score = 0;
var awaiting_feedback = false;
    
var questions = [{
        question: "Why might a company include a logo on their website?",
        answers: [{
            text: "It looks cool!",
            feedback: "Logos usually look pretty cool! But this isn't the main reason a company would include a logo.",
            correct: "incorrect"
        }, {
            text: "So the reader knows who completed the work showcased on the website.",
            feedback: "Having a logo means the reader knows who completed the work, and can do further research on the company if they'd like!",
            correct: "correct"
        }, {
            text: "To fill up space on the website.",
            feedback: "Designers rarely put things on websites just to fill space. Each decision they make is deliberate and carefully thought out.",
            correct: "incorrect"
        }, {
            text: "Option D",
            feedback: "Option D feedback",
            correct: "incorrect"
        }]
    }, {
        question: "Why do many websites include a hero image? Pick two.",
        answers: [{
            text: "To provide a good first impression to the visitor.",
            feedback: "Hero images draw the reader in and are pleasing to the eye. Imagine if you clicked on a website and there was only text!",
            correct: "correct-1"
        }, {
            text: "To capture the reader's attention.",
            feedback: "An awesome image helps to capture the reader's attention! ",
            correct: "correct-2"
        }, {
            text: "To fill up space on the website.",
            feedback: "Designers rarely put things on websites just to fill space. Each decision they make is deliberate and carefully thought out.",
            correct: "incorrect"
        }, {
            text: "Option D",
            feedback: "Option D feedback",
            correct: "incorrect"
        }]
    }, {
        question: "Why might a designer write their titles using larger letters or all capitals?",
        answers: [{
            text: "All titles should be written in capitals.",
            feedback: "This isn't true. Many titles are written in Title Case,vwhich is when the first letter of each important word is a capital.Only sometimes do people write titles in all capital letters.",
            correct: "incorrect"
        }, {
            text: "To make it seem like there's more information on the page",
            feedback: "This isn't a good idea. Websites should only share information that is worth sharing, and not give a false impression about the amount of content to readers!",
            correct: "incorrect"
        }, {
            text: "To capture the reader's attention",
            feedback: "Using all capitals or making the title larger can help to draw the reader's attention and make the title stand out from the other text on the page. However you need to be careful, as sometimes using all capitals makes it SEEM LIKE YOUR'RE YELLING!",
            correct: "correct"
        }]
    }, {
        question: "Why might a designer use smaller lettering when sharing a lot of information?",
        answers: [{
            text: "You should always use small lettering on a website.",
            feedback: "This isn't true. Having one or two different sizes of lettering can make your website more interesting. Designers often use one size for headings, another size for subheadings, and a third size for the content of a paragraph. Be careful though, too many different font sizes can be confusing to the reader!",
            correct: "incorrect"
        }, {
            text: "To make it seem like there's less information on the page.",
            feedback: "This isn't a good idea. Websites should only share information that is worth sharing, and not give a false impression about the amount of content to readers!",
            correct: "incorrect"
        }, {
            text: "So that the writing does not take up too much space on the page.",
            feedback: "Using smaller lettering to share greater amounts of information is a good idea. Otherwise, the webpage is going to be filled with large lettering and will be difficult to read!",
            correct: "correct"
        }, {
            text: "So that the reader needs to squint to read it!",
            feedback: "Don't do this to your poor reader!",
            correct: "incorrect"
        }]
    }, {
        question: "Why might a designer choose a simple colour scheme. Pick two.",
        answers: [{
            text: "So that the reader is not distracted by too many colors!",
            feedback: "Too many colors can be distracting to the reader. It's a good idea to only use a few main colors on your website.",
            correct: "correct-1"
        }, {
            text: "To make it seem like there's less information on the page.",
            feedback: "This isn't a good idea. Websites should only share information that is worth sharing, and not give a false impression about the amount of content to readers!",
            correct: "incorrect"
        }, {
            text: "To provide good contrast so that the writing is easy to read.",
            feedback: "Using similar colors can make the page easy to read. For example, you wouldn't want to use yellow lettering on a white background, since this will make the lettering difficult to read.",
            correct: "correct-2"
        }, {
            text: "The computer isn't able to handle a lot of colors.",
            feedback: "This isn't true. Computers can handle displaying a lot of different colors!",
            correct: "incorrect"
        }]
    }, {
        question: "<div>How could you improve this website?</div><div class='card'><p>Habitats</p><p>In order to live on Mars, habitats need to be built that can contain oxygen to breath, and are easy to manufacture.</p></div>",
        answers: 'short-answer'
    }, {
        question: "<div>What could you put at the top of a webpage to make it more interesting to the viewer?</div>",
        answers: 'short-answer'
    }, {
        question: "<div>What's wrong with the text below? What could you do to improve it?</div><p style='color:lightblue'>The shape of the habitat allows it to stand up to the pressurized environment inside.</p>",
        answers: 'short-answer'
    }, {
        question: "What was your favourite part of the websites you looked at?",
        answers: 'short-answer'
    }, {
        question: "Of the websites that we looked at, what is one thing that you think they could do better?",
        answers: 'short-answer'
    }, {
        question: "What different types of things have you read on the internet? Name as many as possible!",
        answers: 'short-answer'
    }, {
        question: "Describe what a hero image is in your own words.",
        answers: 'short-answer'
    }, {
        question: "Describe what a render is in your own words.",
        answers: 'short-answer'
    }, {
        question: "Out of the habitat designs that you saw, which one was your favourite? Why?",
        answers: 'short-answer'
    }, {
        question: "What could you do to this text to make it look more like a title?<p>Habitats</p>",
        answers: 'short-answer'
    }, {
        question: "Now that you've seen some habitat designs, what designs do you want to include in your habitat design?",
        answers: 'short-answer'
    }, {
        question: "At the top of each website you looked at was a bar with different links on it. What do you think this bar is used for?",
        answers: 'short-answer'
    }, {
        question: "Some websites have videos and other websites have images. Some have both! What do you think is better - having images on your website or having videos? Why?",
        answers: 'short-answer'
    }]

    /* HTML elements */
    var answer_area = document.getElementById('answer-area');
    var feedback_area = document.getElementById('answer-feedback-box')
    var feedback_box = document.getElementById('answer-feedback-box');
    var footer = document.getElementById('footer')
    var gameBoard = document.getElementById('gameBoard')
    var home_screen = document.getElementById('home-screen');
    var img = document.getElementById('gameBoard-image');
    var question_area = document.getElementById('question-area');
    var question_modal = document.getElementById('questionModal');
    var teacher_dashboard = document.getElementById('teacher-dashboard');

    /**
     * Starts the game
     *
     */
    function startGame() {
        name = document.getElementById("name").value ||"Space Architect";
        if (name.toLowerCase() == "teacher") {
            showTeacherDashboard();
        }
        console.log(`My nickname is ${name}`)
        home_screen.style.display = 'none';

        gameBoard.style.display = 'block';
        footer.style.display = "flex";

        socket.on('feedback', (feedback => {
            handleFeedback(feedback);
        }))
    }

    /**
     * Shows the teacher dashboard
     *
     */
    function showTeacherDashboard() {
        socket.emit('teacher-connected', "I am the teacher");
        teacher_dashboard.style.display = 'block';
        socket.on('teacher-connected', (feedback_queue) => {
            handleFeedbackQueue(feedback_queue);
        })
        socket.on('feedback-request', (feedback_request) => {
            handleFeedbackRequest(feedback_request);
        })

    }

    

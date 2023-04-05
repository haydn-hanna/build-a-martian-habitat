let allCorrect = 0;
let name="";
const socket = io();
let score = 0;
let awaiting_feedback = false;
    
const questions = [{
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
        feedback: "Using smaller lettering to share greater amounts of information is a good",
        correct: "correct"
    }]
}];
# build-a-martian-habitat
A quiz game where each correct answer means another piece of your habitat is built!

This is a simple javascript game for students learning about Mars during my Outschool lessons. The lesson is about website design - so most questions have to do with design decisions of websites. Each time a question is answered correctly, a piece of the habitat is printed onto the screen.

This project makes use of socket.io so that students can submit answers to a teacher for feedback. You can access the teacher dashboard by typing 'Teacher' into the 'name' field when you start the game. You can easily connect to a database if you'd like more robust usernames and passwords to access the teacher dashboard. 

The project is stored in a Dockerfile container so that it can be deployed on Google Cloud Run. 

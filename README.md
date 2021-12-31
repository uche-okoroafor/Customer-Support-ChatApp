# Customer-Support-ChatApp

This application is an online support system where the customer will ask questions and the support team will answer. It is designed to help customers channel their concerns to a customer support agent who will respond as soon as possible.

## Contributors:

[Uche okoroafor](https://github.com/uche-okoroafor)

# How It Works

When the customer asks a question, the first and default status of the question should be "Not Answered", and as the support team reply then the status will change to "In Progress" if the customer is satisfied with the response then the support team can change the status to "Answered". If the support team answered the question and then the customer has not replied again for 24 hours then the question status should automatically change to "Answered

## Customer Side Features:

- The customer should see all his questions of all statuses ("Not Answered", "In Progress" and "Answered")
- The customer can ask a new question

## Support Team Features:

-     Can see and search questions based on a customer name or question status
-     Can mark the question as "SPAM". This is a kind of 4th status for the question
-     When the question is answered the customer should be notified by email

## General Features:

- User login/sign up authentication.
- Real-time Chat, changes will update on screen.

## Tools and Technologies Used:

### Frontend

- [React](https://reactjs.org/) - The framework used for developing the components and UI.
- [Material UI](https://material-ui.com/) - Javascript framework for styling and CSS compartmentalization.

### Backend

- [PHP](https://reactjs.org/)/[Laravel](https://expressjs.com/) - Backend used for our APIs.
-     MySQL - Database used to store our user and application data.
- [Pusher](https://pusher.com/) - library for creating real-time chat.
- [Algolia search](https://Algolia.com/) - API used for searching the Database.

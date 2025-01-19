const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signupDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema and model for user data
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Handle form submission
app.post('/signup', (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.psw
    });

    newUser.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.send('Successfully signed up!');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
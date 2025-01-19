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
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/signup', async (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.psw
    });

    try {
        await newUser.save();
        console.log('User saved successfully:', newUser);
        res.redirect('/login.html'); // Redirect to login.html after successful signup
    } catch (err) {
        console.error('Error saving user:', err);
        res.send('Error saving user.');
    }
});

// handle login form submission
app.post('/login', async (req, res) => {
    const { uname, psw } = req.body;

    try {
        const user = await User.findOne({ email: uname, password: psw });
        if (user) {
            console.log('User logged in successfully:', user);
            res.redirect('/home.html'); // Redirect to home.html after successful login
        } else {
            console.log('Invalid email or password.');
            
        }
     } catch (err) {
            console.error('Error logging in:', err);
            res.send('Error logging in.');
        }
 });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
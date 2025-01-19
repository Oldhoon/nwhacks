const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signupDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema and model for journal entries
const journalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    entry: String,
    score: Number,
    mood: String,
    date: { type: Date, default: Date.now }
});

const Journal = mongoose.model('Journal', journalSchema);

// Create a schema and model for user data
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    journals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Journal' }]
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle signup form submission
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

// Handle login form submission
app.post('/login', async (req, res) => {
    const { uname, psw } = req.body;

    try {
        const user = await User.findOne({ email: uname, password: psw });
        if (user) {
            console.log('User logged in successfully:', user);
            res.redirect('/home.html?userId=${user._id}'); // Render home page with user ID
        } else {
            console.log('Invalid email or password.');
            res.send('Invalid email or password.');
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.send('Error logging in.');
    }
});

// Handle journal entry form submission
app.post('/journal', async (req, res) => {
    const { userId, entry, score, mood } = req.body;

    const newJournal = new Journal({
        userId: userId,
        entry: entry,
        score: score,
        mood: mood
    });

    try {
        const savedJournal = await newJournal.save();
        await User.findByIdAndUpdate(userId, { $push: { journals: savedJournal._id } });
        console.log('Journal entry saved successfully:', savedJournal);
        res.redirect('/journal.html'); // Redirect to journal.html after saving the entry
    } catch (err) {
        console.error('Error saving journal entry:', err);
        res.send('Error saving journal entry.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
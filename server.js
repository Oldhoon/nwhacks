// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const path = require('path');

// const app = express();
// const port = process.env.PORT || 4000; // const port = 3000;

// // Connect to MongoDB
// // youngs: mongoose.connect('mongodb://localhost:27017/signupDB', { useNewUrlParser: true, useUnifiedTopology: true });
// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = process.env.MONGODB_URI || "mongodb+srv://jacky05wang:<db_password>@journalnw.63uws.mongodb.net/?retryWrites=true&w=majority";

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("Connected to MongoDB Atlas"))
//     .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Create a schema and model for user data
// const userSchema = new mongoose.Schema({
//     email: String,
//     password: String
// });

// const User = mongoose.model('User', userSchema);

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// // Handle form submission
// app.post('/signup', async (req, res) => {
//     const newUser = new User({
//         email: req.body.email,
//         password: req.body.psw
//     });

//     try {
//         await newUser.save();
//         console.log('User saved successfully:', newUser);
//         res.redirect('/login.html'); // Redirect to login.html after successful signup
//     } catch (err) {
//         console.error('Error saving user:', err);
//         res.send('Error saving user.');
//     }
// });

// // handle login form submission
// app.post('/login', async (req, res) => {
//     const { uname, psw } = req.body;

//     try {
//         const user = await User.findOne({ email: uname, password: psw });
//         if (user) {
//             console.log('User logged in successfully:', user);
//             res.redirect('/home.html'); // Redirect to home.html after successful login
//         } else {
//             console.log('Invalid email or password.');
            
//         }
//      } catch (err) {
//             console.error('Error logging in:', err);
//             res.send('Error logging in.');
//         }
//  });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 4000;

// Check for required environment variables
if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
}

// Connect to MongoDB Atlas
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

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

// Handle form submission for signup
app.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.psw, 10);
    const newUser = new User({
        email: req.body.email,
        password: hashedPassword
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
        const user = await User.findOne({ email: uname });
        if (user && await bcrypt.compare(psw, user.password)) {
            console.log('User logged in successfully:', user);
            res.redirect('/home.html?userId=${user._id}'); // Render home page with user ID
        } else {
            console.log('Invalid email or password.');
            res.status(401).send('Invalid email or password.');
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.send('Error logging in.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

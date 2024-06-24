const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/event-management', { useNewUrlParser: true, useUnifiedTopology: true });

const Registration = mongoose.model('Registration', {
    fullName: String,
    emailAddress: String,
    eventName: String
});

app.use(express.json());

app.post('/api/v1/register', async(req, res) => {
    try {
        const { fullName, emailAddress, eventName } = req.body;

        // Input validation
        if (!fullName || !emailAddress || !eventName) {
            return res.status(400).json({ error: 'Please fill in all fields.' });
        }

        if (!/^[a-zA-Z ]+$/.test(fullName)) {
            return res.status(400).json({ error: 'Invalid full name.' });
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAddress)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        const registration = new Registration(req.body);
        await registration.save();
        io.emit('newRegistration', registration);
        res.json({ message: 'Registration successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering' });
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
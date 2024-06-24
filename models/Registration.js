const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    fullName: String,
    emailAddress: String,
    eventName: String
});

module.exports = mongoose.model('Registration', registrationSchema);
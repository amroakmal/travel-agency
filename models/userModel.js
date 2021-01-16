const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please insert your name']
    },
    password: {
        type: String,
        required: [true, 'Please insert your password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password']
    },
    email: {
        type: String,
        required: [true, 'Please insert your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please insert a valid email']
    },
    photo: String
});

const userModel = mongoose.Model('User', UserSchema);

module.exports = userModel;
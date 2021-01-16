const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please insert your name']
    },
    password: {
        type: String,
        required: [true, 'Please insert your password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: `Passwords don't match.`
        }
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

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    
    next();
});

userSchema.methods.correctPassword = async function(insertedPassword, receivedFromDBPAssword) {
    return await bcrypt.compare(insertedPassword, receivedFromDBPAssword);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
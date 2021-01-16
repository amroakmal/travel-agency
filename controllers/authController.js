const catchAsync = require('../utils/catchAsync');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        photo: req.body.photo
    });
    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWE_EXPIRES_IN
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            newUser
        }
    })
});
const catchAsync = require('../utils/catchAsync');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWE_EXPIRES_IN});
}

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        photo: req.body.photo
    });

    newUser.print();
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const body = Object.create(req.body);
    const { email, password } = body;
    if(!email || !password) {
        return next(new AppError('Please provide the email and the password!', 400));
    } 

    const user = await UserModel.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Email or password is in correct!', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});
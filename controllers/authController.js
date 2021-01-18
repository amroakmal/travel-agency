const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWE_EXPIRES_IN});
}

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await UserModel.create(req.body);

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

exports.protect = catchAsync(async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        return next(new AppError('Please login first', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if(!user) {
        return next(new AppError('User belong to that Token does not exist anymore', 401));
    }
    if(user.passwordChangedAfter(decoded.iat)) {
        return next(new AppError('Recently changed password! login again', 401));
    }
    req.user = user;
    next();
});
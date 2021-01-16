const UserModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await UserModel.find();

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Under development',
        responseTime: new Date() - req.requestTime,
    })
}

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Under development',
        responseTime: new Date() - req.requestTime,
    })
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Under development',
        responseTime: new Date() - req.requestTime,
    })
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Under development',
        responseTime: new Date() - req.requestTime,
    })
}
const catchAsync = require('../utils/catchAsync');
const UserModel = require('../models/userModel');

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        photo: req.body.photo
    });
    
    res.status(201).json({
        status: 'success',
        data: {
            newUser
        }
    })
});
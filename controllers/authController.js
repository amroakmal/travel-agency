const catchAsync = require('../utils/catchAsync');
const UserModel = require('../models/userModel');

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await UserModel.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
            newUser
        }
    })
});
const TourModel = require('../models/tourModel');

exports.getTour = async(req, res) => {
    try {
        const tour = await TourModel.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 1,
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await TourModel.create(req.body);

        res.status(201).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 1,
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid data sent!'
        })
    }
}

exports.getAllTours = async (req, res) => {
    try {
        const tours = await TourModel.find();
        res.status(200).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            requestTime: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 1,
            data: {
                updatedTour
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await TourModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            responseTime: new Date() - req.requestTime,
            results: 0,
            data: null
        });
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            message: err
        })
    }
}

const TourModel = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,summary,ratingsAverage,difficulty';
    next();
}

exports.getTour = catchAsync(async(req, res, next) => {
    const tour = await TourModel.findById(req.params.id);
    
    res.status(200).json({
        status: 'success',
        responseTime: new Date() - req.requestTime,
        data: {
            tour
        }
    });    
});

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await TourModel.create(req.body);
    res.status(201).json({
        status: 'success',
        responseTime: new Date() - req.requestTime,
        results: 1,
        data: {
            newTour
        }
    });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
    //await the "query" variable to get executes, i.e. execute the query variable by making the required
    //query and return the results to the tours variable
    const features = new APIFeatures(TourModel.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;
    res.status(200).json({
        status: 'success',
        responseTime: new Date() - req.requestTime,
        requestTime: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
})

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    await TourModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        responseTime: new Date() - req.requestTime,
        results: 0,
        data: null
    });
});

exports.getTourStats = catchAsync(async(req, res, next) => {
    const stats = await TourModel.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: { 
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async(req, res, next) => {
    const year = req.params.year * 1;
    const plan = await TourModel.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numToursStart: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { 
                _id: 0
            }
        },
        {
            $sort: { numToursStart: -1 }
        },
        {
            $limit: 12
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});